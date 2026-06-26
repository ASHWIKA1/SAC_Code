package com.sac.erp.modules.finance.controller;

import com.sac.erp.modules.finance.entity.ExpenseHead;
import com.sac.erp.modules.finance.service.ExpenseHeadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/finance/expensehead")
@RequiredArgsConstructor
public class ExpenseHeadController {

    private final ExpenseHeadService service;

    @GetMapping
    public ResponseEntity<List<ExpenseHead>> getAll() {
        log.info("REST request to get all ExpenseHeads");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseHead> getById(@PathVariable Long id) {
        log.info("REST request to get ExpenseHead : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseHead> create(@RequestBody ExpenseHead entity) {
        log.info("REST request to create ExpenseHead");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseHead> update(@PathVariable Long id, @RequestBody ExpenseHead entity) {
        log.info("REST request to update ExpenseHead : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete ExpenseHead : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
