package com.sac.erp.modules.fees.controller;

import com.sac.erp.modules.fees.entity.AppliedCoupon;
import com.sac.erp.modules.fees.service.AppliedCouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fees/appliedcoupon")
@RequiredArgsConstructor
public class AppliedCouponController {

    private final AppliedCouponService service;

    @GetMapping
    public ResponseEntity<List<AppliedCoupon>> getAll() {
        log.info("REST request to get all AppliedCoupons");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppliedCoupon> getById(@PathVariable Long id) {
        log.info("REST request to get AppliedCoupon : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<AppliedCoupon> create(@RequestBody AppliedCoupon entity) {
        log.info("REST request to create AppliedCoupon");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppliedCoupon> update(@PathVariable Long id, @RequestBody AppliedCoupon entity) {
        log.info("REST request to update AppliedCoupon : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete AppliedCoupon : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
