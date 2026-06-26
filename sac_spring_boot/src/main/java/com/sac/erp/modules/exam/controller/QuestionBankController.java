package com.sac.erp.modules.exam.controller;

import com.sac.erp.modules.exam.entity.QuestionBank;
import com.sac.erp.modules.exam.service.QuestionBankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/exam/questionbank")
@RequiredArgsConstructor
public class QuestionBankController {

    private final QuestionBankService service;

    @GetMapping
    public ResponseEntity<List<QuestionBank>> getAll() {
        log.info("REST request to get all QuestionBanks");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionBank> getById(@PathVariable Long id) {
        log.info("REST request to get QuestionBank : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<QuestionBank> create(@RequestBody QuestionBank entity) {
        log.info("REST request to create QuestionBank");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionBank> update(@PathVariable Long id, @RequestBody QuestionBank entity) {
        log.info("REST request to update QuestionBank : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete QuestionBank : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
