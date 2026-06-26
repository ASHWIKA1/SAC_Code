package com.sac.erp.modules.fees.controller;

import com.sac.erp.modules.fees.entity.FeesCarryForward;
import com.sac.erp.modules.fees.service.FeesCarryForwardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fees/feescarryforward")
@RequiredArgsConstructor
public class FeesCarryForwardController {

    private final FeesCarryForwardService service;

    @GetMapping
    public ResponseEntity<List<FeesCarryForward>> getAll() {
        log.info("REST request to get all FeesCarryForwards");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeesCarryForward> getById(@PathVariable Long id) {
        log.info("REST request to get FeesCarryForward : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FeesCarryForward> create(@RequestBody FeesCarryForward entity) {
        log.info("REST request to create FeesCarryForward");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeesCarryForward> update(@PathVariable Long id, @RequestBody FeesCarryForward entity) {
        log.info("REST request to update FeesCarryForward : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete FeesCarryForward : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
