package com.sac.erp.modules.exam.controller;

import com.sac.erp.modules.exam.entity.QuestionBankMuOption;
import com.sac.erp.modules.exam.service.QuestionBankMuOptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/exam/questionbankmuoption")
@RequiredArgsConstructor
public class QuestionBankMuOptionController {

    private final QuestionBankMuOptionService service;

    @GetMapping
    public ResponseEntity<List<QuestionBankMuOption>> getAll() {
        log.info("REST request to get all QuestionBankMuOptions");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionBankMuOption> getById(@PathVariable Long id) {
        log.info("REST request to get QuestionBankMuOption : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<QuestionBankMuOption> create(@RequestBody QuestionBankMuOption entity) {
        log.info("REST request to create QuestionBankMuOption");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionBankMuOption> update(@PathVariable Long id, @RequestBody QuestionBankMuOption entity) {
        log.info("REST request to update QuestionBankMuOption : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete QuestionBankMuOption : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
