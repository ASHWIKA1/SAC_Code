package com.sac.erp.modules.fees.controller;

import com.sac.erp.modules.fees.entity.*;
import com.sac.erp.modules.fees.service.FeesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
public class FeesController {

    private final FeesService feesService;

    @GetMapping("/groups")
    public ResponseEntity<List<FeesGroup>> getGroups() {
        log.info("REST request to get active fees groups");
        return ResponseEntity.ok(feesService.getAllFeesGroups());
    }

    @PostMapping("/groups")
    public ResponseEntity<FeesGroup> createGroup(@RequestBody FeesGroup feesGroup) {
        log.info("REST request to create fees group: {}", feesGroup.getName());
        return ResponseEntity.ok(feesService.createFeesGroup(feesGroup));
    }

    @GetMapping("/types")
    public ResponseEntity<List<FeesType>> getTypes() {
        log.info("REST request to get active fees types");
        return ResponseEntity.ok(feesService.getAllFeesTypes());
    }

    @PostMapping("/types")
    public ResponseEntity<FeesType> createType(@RequestBody FeesType feesType) {
        log.info("REST request to create fees type: {}", feesType.getName());
        return ResponseEntity.ok(feesService.createFeesType(feesType));
    }

    @GetMapping("/masters")
    public ResponseEntity<List<FeesMaster>> getMasters() {
        log.info("REST request to get active fees masters");
        return ResponseEntity.ok(feesService.getAllFeesMasters());
    }

    @PostMapping("/masters")
    public ResponseEntity<FeesMaster> createMaster(@RequestBody FeesMaster feesMaster) {
        log.info("REST request to create fees master");
        return ResponseEntity.ok(feesService.createFeesMaster(feesMaster));
    }

    @GetMapping("/discounts")
    public ResponseEntity<List<FeesDiscount>> getDiscounts() {
        log.info("REST request to get active fees discounts");
        return ResponseEntity.ok(feesService.getAllFeesDiscounts());
    }

    @PostMapping("/discounts")
    public ResponseEntity<FeesDiscount> createDiscount(@RequestBody FeesDiscount feesDiscount) {
        log.info("REST request to create fees discount: {}", feesDiscount.getName());
        return ResponseEntity.ok(feesService.createFeesDiscount(feesDiscount));
    }

    @GetMapping("/payments/student/{studentId}")
    public ResponseEntity<List<FeesPayment>> getPaymentsByStudent(@PathVariable Long studentId) {
        log.info("REST request to get payments for student: {}", studentId);
        return ResponseEntity.ok(feesService.getPaymentsByStudent(studentId));
    }

    @PostMapping("/payments/collect")
    public ResponseEntity<FeesPayment> collectPayment(@RequestBody FeesPayment payment) {
        log.info("REST request to collect fees payment for student: {}", payment.getStudentId());
        return ResponseEntity.ok(feesService.collectPayment(payment));
    }
}
