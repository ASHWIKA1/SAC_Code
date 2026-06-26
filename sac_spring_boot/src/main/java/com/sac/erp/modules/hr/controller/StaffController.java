package com.sac.erp.modules.hr.controller;

import com.sac.erp.modules.hr.entity.Staff;
import com.sac.erp.modules.hr.service.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/hr/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaffs() {
        log.info("REST request to get all staff profiles");
        return ResponseEntity.ok(staffService.getAllStaffs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        log.info("REST request to get staff profile: {}", id);
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PostMapping
    public ResponseEntity<Staff> createStaff(
            @RequestBody Staff staff,
            @RequestParam(value = "designationId", required = false) Long designationId,
            @RequestParam(value = "departmentId", required = false) Long departmentId) {
        log.info("REST request to create staff record: {}", staff.getFullName());
        Staff createdStaff = staffService.createStaff(staff, designationId, departmentId);
        return ResponseEntity.ok(createdStaff);
    }
}
