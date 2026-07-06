package com.sac.erp.modules.finance.controller;

import com.sac.erp.modules.finance.entity.BankStatement;
import com.sac.erp.modules.finance.service.BankStatementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/finance/bankstatement")
@RequiredArgsConstructor
public class BankStatementController {

    private final BankStatementService service;

    @GetMapping
    public ResponseEntity<List<BankStatement>> getAll() {
        log.info("REST request to get all BankStatements");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankStatement> getById(@PathVariable Long id) {
        log.info("REST request to get BankStatement : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BankStatement> create(@RequestBody BankStatement entity) {
        log.info("REST request to create BankStatement");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankStatement> update(@PathVariable Long id, @RequestBody BankStatement entity) {
        log.info("REST request to update BankStatement : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete BankStatement : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
