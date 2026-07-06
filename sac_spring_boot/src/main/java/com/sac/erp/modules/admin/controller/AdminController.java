package com.sac.erp.modules.admin.controller;

import com.sac.erp.modules.admin.entity.*;
import com.sac.erp.modules.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getComplaints() {
        log.info("REST request to get all complaints");
        return ResponseEntity.ok(adminService.getAllComplaints());
    }

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        log.info("REST request to file complaint by: {}", complaint.getComplaintBy());
        return ResponseEntity.ok(adminService.createComplaint(complaint));
    }

    @GetMapping("/visitors")
    public ResponseEntity<List<Visitor>> getVisitors() {
        log.info("REST request to get all visitor logs");
        return ResponseEntity.ok(adminService.getAllVisitors());
    }

    @PostMapping("/visitors")
    public ResponseEntity<Visitor> recordVisitor(@RequestBody Visitor visitor) {
        log.info("REST request to log visitor: {}", visitor.getName());
        return ResponseEntity.ok(adminService.recordVisitor(visitor));
    }

    @GetMapping("/postal")
    public ResponseEntity<List<PostalLog>> getPostalLogs() {
        log.info("REST request to get all postal logs");
        return ResponseEntity.ok(adminService.getAllPostalLogs());
    }

    @PostMapping("/postal")
    public ResponseEntity<PostalLog> recordPostalLog(@RequestBody PostalLog postalLog) {
        log.info("REST request to log postal post from: {}", postalLog.getFromTitle());
        return ResponseEntity.ok(adminService.recordPostalLog(postalLog));
    }
}
