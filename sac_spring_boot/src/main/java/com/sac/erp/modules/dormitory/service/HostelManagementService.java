package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.*;

import java.util.List;
import java.util.Map;

public interface HostelManagementService {
    
    // Stats
    Map<String, Object> getDashboardStats();

    // Rooms & Room Types
    List<HostelRoom> getAllRooms();
    HostelRoom createRoom(HostelRoom room);
    List<HostelRoomType> getAllRoomTypes();

    // Allocations
    List<HostelAllocation> getAllAllocations();
    HostelAllocation createAllocation(HostelAllocation allocation);
    HostelAllocation transferRoom(Long allocationId, Long newRoomId, Integer newBedNumber);
    HostelAllocation vacateRoom(Long allocationId);

    // Visitors
    List<HostelVisitor> getAllVisitors();
    HostelVisitor checkInVisitor(HostelVisitor visitor);
    HostelVisitor checkOutVisitor(Long visitorId);

    // Mess Billing
    List<HostelMessBilling> getAllMessBillings();
    HostelMessBilling createMessBilling(HostelMessBilling billing);
    List<HostelMessBilling> generateBatchMessBilling(Long hostelId, String billingMonth, String messPlan, Double baseAmount, Double additionalCharges);
    HostelMessBilling markBillAsPaid(Long billingId, String reference, String remarks);

    // Mess Plans
    List<HostelMessPlan> getAllMessPlans();
    HostelMessPlan saveMessPlan(HostelMessPlan plan);

    // Discipline
    List<HostelDisciplineLog> getAllDisciplineLogs();
    HostelDisciplineLog addDisciplineLog(HostelDisciplineLog log);
    HostelDisciplineLog updateDisciplineLogStatus(Long logId, String status, String actionTaken);

    // RFID logs
    List<HostelRfidLog> getAllRfidLogs();
    HostelRfidLog addRfidLog(HostelRfidLog rfidLog);
}
