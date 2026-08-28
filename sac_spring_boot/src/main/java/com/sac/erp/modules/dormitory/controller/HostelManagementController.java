package com.sac.erp.modules.dormitory.controller;

import com.sac.erp.modules.dormitory.entity.*;
import com.sac.erp.modules.dormitory.service.HostelManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/hostel")
@RequiredArgsConstructor
public class HostelManagementController {

    private final HostelManagementService hostelManagementService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        log.info("REST request to get Hostel dashboard stats");
        return ResponseEntity.ok(hostelManagementService.getDashboardStats());
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<HostelRoom>> getAllRooms() {
        log.info("REST request to get all rooms");
        return ResponseEntity.ok(hostelManagementService.getAllRooms());
    }

    @GetMapping("/room-types")
    public ResponseEntity<List<HostelRoomType>> getAllRoomTypes() {
        log.info("REST request to get all room types");
        return ResponseEntity.ok(hostelManagementService.getAllRoomTypes());
    }

    @GetMapping("/allocations")
    public ResponseEntity<List<HostelAllocation>> getAllAllocations() {
        log.info("REST request to get all room allocations");
        return ResponseEntity.ok(hostelManagementService.getAllAllocations());
    }

    @PostMapping("/allocations")
    public ResponseEntity<HostelAllocation> createAllocation(@RequestBody HostelAllocation allocation) {
        log.info("REST request to create allocation: {}", allocation);
        return ResponseEntity.ok(hostelManagementService.createAllocation(allocation));
    }

    @PutMapping("/allocations/{id}/transfer")
    public ResponseEntity<HostelAllocation> transferRoom(
            @PathVariable Long id,
            @RequestParam Long newRoomId,
            @RequestParam(required = false, defaultValue = "1") Integer bedNumber) {
        log.info("REST request to transfer room for allocation: {}, new room: {}", id, newRoomId);
        return ResponseEntity.ok(hostelManagementService.transferRoom(id, newRoomId, bedNumber));
    }

    @PutMapping("/allocations/{id}/vacate")
    public ResponseEntity<HostelAllocation> vacateRoom(@PathVariable Long id) {
        log.info("REST request to vacate room for allocation: {}", id);
        return ResponseEntity.ok(hostelManagementService.vacateRoom(id));
    }

    @GetMapping("/visitors")
    public ResponseEntity<List<HostelVisitor>> getAllVisitors() {
        log.info("REST request to get all visitors");
        return ResponseEntity.ok(hostelManagementService.getAllVisitors());
    }

    @PostMapping("/visitors")
    public ResponseEntity<HostelVisitor> checkInVisitor(@RequestBody HostelVisitor visitor) {
        log.info("REST request to check-in visitor: {}", visitor);
        return ResponseEntity.ok(hostelManagementService.checkInVisitor(visitor));
    }

    @PutMapping("/visitors/{id}/checkout")
    public ResponseEntity<HostelVisitor> checkOutVisitor(@PathVariable Long id) {
        log.info("REST request to check-out visitor: {}", id);
        return ResponseEntity.ok(hostelManagementService.checkOutVisitor(id));
    }

    @GetMapping("/mess-billings")
    public ResponseEntity<List<HostelMessBilling>> getAllMessBillings() {
        log.info("REST request to get all mess billings");
        return ResponseEntity.ok(hostelManagementService.getAllMessBillings());
    }

    @PostMapping("/mess-billings")
    public ResponseEntity<HostelMessBilling> createMessBilling(@RequestBody HostelMessBilling billing) {
        log.info("REST request to create mess billing");
        return ResponseEntity.ok(hostelManagementService.createMessBilling(billing));
    }

    @PostMapping("/mess-billings/batch")
    public ResponseEntity<List<HostelMessBilling>> generateBatchMessBilling(
            @RequestParam Long hostelId,
            @RequestParam String billingMonth,
            @RequestParam(required = false, defaultValue = "Standard") String messPlan,
            @RequestParam(required = false, defaultValue = "3000.00") Double baseAmount,
            @RequestParam(required = false, defaultValue = "0.00") Double additionalCharges) {
        log.info("REST request to generate batch mess billing for hostel: {}, month: {}", hostelId, billingMonth);
        return ResponseEntity.ok(hostelManagementService.generateBatchMessBilling(hostelId, billingMonth, messPlan, baseAmount, additionalCharges));
    }

    @PutMapping("/mess-billings/{id}/pay")
    public ResponseEntity<HostelMessBilling> markBillAsPaid(
            @PathVariable Long id,
            @RequestParam String reference,
            @RequestParam(required = false) String remarks) {
        log.info("REST request to mark mess billing: {} as paid", id);
        return ResponseEntity.ok(hostelManagementService.markBillAsPaid(id, reference, remarks));
    }

    @GetMapping("/mess-plans")
    public ResponseEntity<List<HostelMessPlan>> getAllMessPlans() {
        log.info("REST request to get all mess plans");
        return ResponseEntity.ok(hostelManagementService.getAllMessPlans());
    }

    @PostMapping("/mess-plans")
    public ResponseEntity<HostelMessPlan> saveMessPlan(@RequestBody HostelMessPlan plan) {
        log.info("REST request to save mess plan");
        return ResponseEntity.ok(hostelManagementService.saveMessPlan(plan));
    }

    @GetMapping("/discipline")
    public ResponseEntity<List<HostelDisciplineLog>> getAllDisciplineLogs() {
        log.info("REST request to get all discipline logs");
        return ResponseEntity.ok(hostelManagementService.getAllDisciplineLogs());
    }

    @PostMapping("/discipline")
    public ResponseEntity<HostelDisciplineLog> addDisciplineLog(@RequestBody HostelDisciplineLog logRecord) {
        log.info("REST request to add discipline log: {}", logRecord);
        return ResponseEntity.ok(hostelManagementService.addDisciplineLog(logRecord));
    }

    @PutMapping("/discipline/{id}")
    public ResponseEntity<HostelDisciplineLog> updateDisciplineLogStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String actionTaken) {
        log.info("REST request to update discipline log: {} status to: {}", id, status);
        return ResponseEntity.ok(hostelManagementService.updateDisciplineLogStatus(id, status, actionTaken));
    }

    @GetMapping("/rfid-logs")
    public ResponseEntity<List<HostelRfidLog>> getAllRfidLogs() {
        log.info("REST request to get all RFID logs");
        return ResponseEntity.ok(hostelManagementService.getAllRfidLogs());
    }

    @PostMapping("/rfid-logs")
    public ResponseEntity<HostelRfidLog> addRfidLog(@RequestBody HostelRfidLog rfidLog) {
        log.info("REST request to add RFID scan log");
        return ResponseEntity.ok(hostelManagementService.addRfidLog(rfidLog));
    }
}
