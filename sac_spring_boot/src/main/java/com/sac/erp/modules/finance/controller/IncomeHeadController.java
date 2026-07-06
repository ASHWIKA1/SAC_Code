package com.sac.erp.modules.finance.controller;

import com.sac.erp.modules.finance.entity.IncomeHead;
import com.sac.erp.modules.finance.service.IncomeHeadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/finance/incomehead")
@RequiredArgsConstructor
public class IncomeHeadController {

    private final IncomeHeadService service;

    @GetMapping
    public ResponseEntity<List<IncomeHead>> getAll() {
        log.info("REST request to get all IncomeHeads");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeHead> getById(@PathVariable Long id) {
        log.info("REST request to get IncomeHead : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<IncomeHead> create(@RequestBody IncomeHead entity) {
        log.info("REST request to create IncomeHead");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeHead> update(@PathVariable Long id, @RequestBody IncomeHead entity) {
        log.info("REST request to update IncomeHead : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete IncomeHead : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
