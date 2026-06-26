package com.sac.erp.modules.finance.controller;

import com.sac.erp.modules.finance.entity.BankPaymentSlip;
import com.sac.erp.modules.finance.service.BankPaymentSlipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/finance/bankpaymentslip")
@RequiredArgsConstructor
public class BankPaymentSlipController {

    private final BankPaymentSlipService service;

    @GetMapping
    public ResponseEntity<List<BankPaymentSlip>> getAll() {
        log.info("REST request to get all BankPaymentSlips");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankPaymentSlip> getById(@PathVariable Long id) {
        log.info("REST request to get BankPaymentSlip : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BankPaymentSlip> create(@RequestBody BankPaymentSlip entity) {
        log.info("REST request to create BankPaymentSlip");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankPaymentSlip> update(@PathVariable Long id, @RequestBody BankPaymentSlip entity) {
        log.info("REST request to update BankPaymentSlip : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete BankPaymentSlip : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
