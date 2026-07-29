package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.*;
import com.sac.erp.modules.dormitory.repository.*;
import com.sac.erp.modules.canteen.service.RealtimeEventPublisher;
import com.sac.erp.modules.finance.entity.Income;
import com.sac.erp.modules.finance.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HostelManagementServiceImpl implements HostelManagementService {

    private final HostelRepository hostelRepository;
    private final HostelRoomRepository hostelRoomRepository;
    private final HostelVisitorRepository hostelVisitorRepository;
    private final HostelRoomTypeRepository hostelRoomTypeRepository;
    private final HostelAllocationRepository hostelAllocationRepository;
    private final HostelMessPlanRepository hostelMessPlanRepository;
    private final HostelMessBillingRepository hostelMessBillingRepository;
    private final HostelDisciplineLogRepository hostelDisciplineLogRepository;
    private final HostelRfidLogRepository hostelRfidLogRepository;
    private final IncomeRepository incomeRepository;
    private final RealtimeEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        List<Hostel> hostels = hostelRepository.findAll();
        List<HostelRoom> rooms = hostelRoomRepository.findAll();
        List<HostelVisitor> visitors = hostelVisitorRepository.findAll();
        List<HostelAllocation> allocations = hostelAllocationRepository.findByStatus("Active");
        List<HostelMessBilling> billings = hostelMessBillingRepository.findByStatus("Pending");

        int totalCapacity = rooms.stream().mapToInt(r -> r.getCapacity() != null ? r.getCapacity() : 0).sum();
        int occupiedBeds = rooms.stream().mapToInt(r -> r.getCurrentOccupancy() != null ? r.getCurrentOccupancy() : 0).sum();
        int vacantBeds = Math.max(0, totalCapacity - occupiedBeds);

        long activeVisitorsToday = visitors.stream()
                .filter(v -> v.getStatus() != null && v.getStatus().equals("checked_in") && v.getCheckOut() == null)
                .count();

        long pendingMessBillsCount = billings.size();

        // Vacancy summary per hostel block
        List<Map<String, Object>> hostelSummaries = new ArrayList<>();
        for (Hostel hostel : hostels) {
            Map<String, Object> summary = new HashMap<>();
            List<HostelRoom> hostelRooms = rooms.stream()
                    .filter(r -> r.getHostelId() != null && r.getHostelId().equals(hostel.getId()))
                    .toList();

            int cap = hostelRooms.stream().mapToInt(r -> r.getCapacity() != null ? r.getCapacity() : 0).sum();
            int occ = hostelRooms.stream().mapToInt(r -> r.getCurrentOccupancy() != null ? r.getCurrentOccupancy() : 0).sum();

            summary.put("hostelId", hostel.getId());
            summary.put("hostelName", hostel.getHostelName());
            summary.put("type", hostel.getType());
            summary.put("capacity", cap);
            summary.put("occupancy", occ);
            summary.put("vacant", Math.max(0, cap - occ));
            summary.put("status", hostel.getStatus());
            hostelSummaries.add(summary);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCapacity", totalCapacity);
        stats.put("occupiedBeds", occupiedBeds);
        stats.put("vacantBeds", vacantBeds);
        stats.put("activeVisitorsToday", activeVisitorsToday);
        stats.put("pendingMessBills", pendingMessBillsCount);
        stats.put("hostels", hostelSummaries);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoom> getAllRooms() {
        return hostelRoomRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoomType> getAllRoomTypes() {
        return hostelRoomTypeRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelAllocation> getAllAllocations() {
        return hostelAllocationRepository.findAll();
    }

    @Override
    @Transactional
    public HostelAllocation createAllocation(HostelAllocation allocation) {
        HostelRoom room = hostelRoomRepository.findById(allocation.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found: " + allocation.getRoomId()));

        int capacity = room.getCapacity() != null ? room.getCapacity() : 1;
        int currentOcc = room.getCurrentOccupancy() != null ? room.getCurrentOccupancy() : 0;

        if (currentOcc >= capacity) {
            throw new RuntimeException("Room " + room.getRoomNo() + " is at full capacity (" + currentOcc + "/" + capacity + ")");
        }

        allocation.setStatus("Active");
        if (allocation.getAllocationDate() == null) {
            allocation.setAllocationDate(LocalDate.now());
        }

        HostelAllocation saved = hostelAllocationRepository.save(allocation);

        // Increment current occupancy
        room.setCurrentOccupancy(currentOcc + 1);
        if (room.getCurrentOccupancy() >= capacity) {
            room.setStatus("occupied");
        }
        hostelRoomRepository.save(room);

        eventPublisher.publish("ROOM_ALLOCATED", "Student " + allocation.getStudentId() + " allocated to Room " + room.getRoomNo());
        return saved;
    }

    @Override
    @Transactional
    public HostelAllocation transferRoom(Long allocationId, Long newRoomId, Integer newBedNumber) {
        HostelAllocation oldAlloc = hostelAllocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found: " + allocationId));

        if (!"Active".equals(oldAlloc.getStatus())) {
            throw new RuntimeException("Cannot transfer from an inactive room allocation");
        }

        // Vacate old room
        HostelRoom oldRoom = hostelRoomRepository.findById(oldAlloc.getRoomId())
                .orElseThrow(() -> new RuntimeException("Old room not found: " + oldAlloc.getRoomId()));
        oldRoom.setCurrentOccupancy(Math.max(0, (oldRoom.getCurrentOccupancy() != null ? oldRoom.getCurrentOccupancy() : 1) - 1));
        oldRoom.setStatus("available");
        hostelRoomRepository.save(oldRoom);

        // Deactivate old allocation
        oldAlloc.setStatus("Transferred");
        oldAlloc.setVacateDate(LocalDate.now());
        hostelAllocationRepository.save(oldAlloc);

        // Allocate to new room
        HostelRoom newRoom = hostelRoomRepository.findById(newRoomId)
                .orElseThrow(() -> new RuntimeException("New room not found: " + newRoomId));

        int newCapacity = newRoom.getCapacity() != null ? newRoom.getCapacity() : 1;
        int newOcc = newRoom.getCurrentOccupancy() != null ? newRoom.getCurrentOccupancy() : 0;

        if (newOcc >= newCapacity) {
            throw new RuntimeException("New Room " + newRoom.getRoomNo() + " is at full capacity (" + newOcc + "/" + newCapacity + ")");
        }

        HostelAllocation newAlloc = new HostelAllocation();
        newAlloc.setStudentId(oldAlloc.getStudentId());
        newAlloc.setRoomId(newRoomId);
        newAlloc.setHostelId(newRoom.getHostelId());
        newAlloc.setBedNumber(newBedNumber != null ? newBedNumber : 1);
        newAlloc.setAllocationDate(LocalDate.now());
        newAlloc.setStatus("Active");
        newAlloc.setRemarks("Transferred from Room " + oldRoom.getRoomNo());
        newAlloc.setSchoolId(oldAlloc.getSchoolId());

        HostelAllocation saved = hostelAllocationRepository.save(newAlloc);

        newRoom.setCurrentOccupancy(newOcc + 1);
        if (newRoom.getCurrentOccupancy() >= newCapacity) {
            newRoom.setStatus("occupied");
        }
        hostelRoomRepository.save(newRoom);

        eventPublisher.publish("ROOM_ALLOCATED", "Student " + oldAlloc.getStudentId() + " transferred to Room " + newRoom.getRoomNo());
        return saved;
    }

    @Override
    @Transactional
    public HostelAllocation vacateRoom(Long allocationId) {
        HostelAllocation allocation = hostelAllocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found: " + allocationId));

        if (!"Active".equals(allocation.getStatus())) {
            throw new RuntimeException("Allocation is already inactive");
        }

        HostelRoom room = hostelRoomRepository.findById(allocation.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found: " + allocation.getRoomId()));

        room.setCurrentOccupancy(Math.max(0, (room.getCurrentOccupancy() != null ? room.getCurrentOccupancy() : 1) - 1));
        room.setStatus("available");
        hostelRoomRepository.save(room);

        allocation.setStatus("Vacated");
        allocation.setVacateDate(LocalDate.now());
        HostelAllocation saved = hostelAllocationRepository.save(allocation);

        eventPublisher.publish("ROOM_ALLOCATED", "Student " + allocation.getStudentId() + " vacated Room " + room.getRoomNo());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelVisitor> getAllVisitors() {
        return hostelVisitorRepository.findAll();
    }

    @Override
    @Transactional
    public HostelVisitor checkInVisitor(HostelVisitor visitor) {
        visitor.setStatus("checked_in");
        if (visitor.getCheckIn() == null) {
            visitor.setCheckIn(LocalDate.now());
        }
        HostelVisitor saved = hostelVisitorRepository.save(visitor);
        eventPublisher.publish("VISITOR_UPDATE", "Visitor " + visitor.getVisitorName() + " checked in");
        return saved;
    }

    @Override
    @Transactional
    public HostelVisitor checkOutVisitor(Long visitorId) {
        HostelVisitor visitor = hostelVisitorRepository.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor record not found: " + visitorId));
        visitor.setStatus("checked_out");
        visitor.setCheckOut(LocalDate.now());
        HostelVisitor saved = hostelVisitorRepository.save(visitor);
        eventPublisher.publish("VISITOR_UPDATE", "Visitor " + visitor.getVisitorName() + " checked out");
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelMessBilling> getAllMessBillings() {
        return hostelMessBillingRepository.findAll();
    }

    @Override
    @Transactional
    public HostelMessBilling createMessBilling(HostelMessBilling billing) {
        if (billing.getBaseAmount() == null) billing.setBaseAmount(BigDecimal.ZERO);
        if (billing.getAdditionalCharges() == null) billing.setAdditionalCharges(BigDecimal.ZERO);
        billing.setTotalAmount(billing.getBaseAmount().add(billing.getAdditionalCharges()));
        
        HostelMessBilling saved = hostelMessBillingRepository.save(billing);
        eventPublisher.publish("BILL_UPDATE", "Mess bill generated for Student " + billing.getStudentId());
        return saved;
    }

    @Override
    @Transactional
    public List<HostelMessBilling> generateBatchMessBilling(Long hostelId, String billingMonth, String messPlan, Double baseAmount, Double additionalCharges) {
        List<HostelAllocation> activeAllocations = hostelAllocationRepository.findByStatus("Active").stream()
                .filter(a -> a.getHostelId() != null && a.getHostelId().equals(hostelId))
                .toList();

        List<HostelMessBilling> billings = new ArrayList<>();
        BigDecimal base = BigDecimal.valueOf(baseAmount != null ? baseAmount : 3000.0);
        BigDecimal additional = BigDecimal.valueOf(additionalCharges != null ? additionalCharges : 0.0);

        for (HostelAllocation allocation : activeAllocations) {
            // Avoid duplicate bills for same month & student
            if (hostelMessBillingRepository.findByStudentIdAndBillingMonth(allocation.getStudentId(), billingMonth).isPresent()) {
                continue;
            }

            HostelMessBilling billing = new HostelMessBilling();
            billing.setStudentId(allocation.getStudentId());
            billing.setHostelId(hostelId);
            billing.setBillingMonth(billingMonth);
            billing.setMessPlan(messPlan != null ? messPlan : "Standard");
            billing.setBaseAmount(base);
            billing.setAdditionalCharges(additional);
            billing.setTotalAmount(base.add(additional));
            billing.setStatus("Pending");
            billing.setSchoolId(allocation.getSchoolId());
            billings.add(hostelMessBillingRepository.save(billing));
        }

        eventPublisher.publish("BILL_UPDATE", "Batch mess billing generated for " + billings.size() + " students in Hostel ID " + hostelId);
        return billings;
    }

    @Override
    @Transactional
    public HostelMessBilling markBillAsPaid(Long billingId, String reference, String remarks) {
        HostelMessBilling billing = hostelMessBillingRepository.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Mess billing record not found: " + billingId));

        if (!"Pending".equalsIgnoreCase(billing.getStatus()) && !"Overdue".equalsIgnoreCase(billing.getStatus())) {
            throw new RuntimeException("Bill is already paid or processed");
        }

        billing.setStatus("Paid");
        billing.setPaymentDate(LocalDate.now());
        billing.setPaymentReference(reference);
        billing.setRemarks(remarks);

        HostelMessBilling saved = hostelMessBillingRepository.save(billing);

        // Integration with Finance Module Ledger: Push paid bill to sm_add_incomes
        try {
            Income income = new Income();
            income.setName("Hostel Mess Bill - Month: " + billing.getBillingMonth() + ", Student ID: " + billing.getStudentId());
            income.setAmount(billing.getTotalAmount().doubleValue());
            income.setDate(LocalDate.now());
            income.setIncomeHeadId(1L); // Default income head for Hostel/Mess Fees
            income.setBankAccountId(1L); // Default bank account
            income.setActiveStatus(1);
            income.setSchoolId(billing.getSchoolId());
            incomeRepository.save(income);
            log.info("Successfully registered mess bill in finance ledger: {}", income.getName());
        } catch (Exception e) {
            log.error("Failed to register mess bill in finance ledger", e);
        }

        eventPublisher.publish("BILL_UPDATE", "Mess bill for Student " + billing.getStudentId() + " marked as Paid");
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelMessPlan> getAllMessPlans() {
        return hostelMessPlanRepository.findAll();
    }

    @Override
    @Transactional
    public HostelMessPlan saveMessPlan(HostelMessPlan plan) {
        if (plan.getEffectiveFrom() == null) {
            plan.setEffectiveFrom(LocalDate.now());
        }
        return hostelMessPlanRepository.save(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelDisciplineLog> getAllDisciplineLogs() {
        return hostelDisciplineLogRepository.findAll();
    }

    @Override
    @Transactional
    public HostelDisciplineLog addDisciplineLog(HostelDisciplineLog log) {
        if (log.getIncidentDate() == null) {
            log.setIncidentDate(LocalDate.now());
        }
        log.setStatus("Under Review");
        HostelDisciplineLog saved = hostelDisciplineLogRepository.save(log);
        eventPublisher.publish("DISCIPLINE_UPDATE", "Discipline record reported for Student " + log.getStudentId());
        return saved;
    }

    @Override
    @Transactional
    public HostelDisciplineLog updateDisciplineLogStatus(Long logId, String status, String actionTaken) {
        HostelDisciplineLog log = hostelDisciplineLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Discipline log not found: " + logId));
        log.setStatus(status);
        if (actionTaken != null) {
            log.setActionTaken(actionTaken);
        }
        HostelDisciplineLog saved = hostelDisciplineLogRepository.save(log);
        eventPublisher.publish("DISCIPLINE_UPDATE", "Discipline record for Student " + log.getStudentId() + " updated to " + status);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRfidLog> getAllRfidLogs() {
        return hostelRfidLogRepository.findAll();
    }

    @Override
    @Transactional
    public HostelRfidLog addRfidLog(HostelRfidLog rfidLog) {
        if (rfidLog.getScanTimestamp() == null) {
            rfidLog.setScanTimestamp(LocalDateTime.now());
        }

        // Fetch Hostel curfew time to flag late entry
        Hostel hostel = hostelRepository.findById(rfidLog.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found: " + rfidLog.getHostelId()));

        LocalTime scanTime = rfidLog.getScanTimestamp().toLocalTime();
        LocalTime curfew = hostel.getCurfewTime() != null ? hostel.getCurfewTime() : LocalTime.of(22, 0);

        if ("IN".equalsIgnoreCase(rfidLog.getGateDirection()) && scanTime.isAfter(curfew)) {
            rfidLog.setEntryStatus("Late Entry");
            rfidLog.setFlagged(1);
        } else {
            rfidLog.setEntryStatus("In-Bounds");
            rfidLog.setFlagged(0);
        }

        HostelRfidLog saved = hostelRfidLogRepository.save(rfidLog);
        eventPublisher.publish("RFID_TAP", "RFID gate scan registered for Student " + rfidLog.getStudentId() + " (" + rfidLog.getEntryStatus() + ")");
        return saved;
    }
}
