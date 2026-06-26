package com.sac.erp.modules.exam.controller;

import com.sac.erp.modules.exam.entity.QuestionGroup;
import com.sac.erp.modules.exam.service.QuestionGroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/exam/questiongroup")
@RequiredArgsConstructor
public class QuestionGroupController {

    private final QuestionGroupService service;

    @GetMapping
    public ResponseEntity<List<QuestionGroup>> getAll() {
        log.info("REST request to get all QuestionGroups");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionGroup> getById(@PathVariable Long id) {
        log.info("REST request to get QuestionGroup : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<QuestionGroup> create(@RequestBody QuestionGroup entity) {
        log.info("REST request to create QuestionGroup");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionGroup> update(@PathVariable Long id, @RequestBody QuestionGroup entity) {
        log.info("REST request to update QuestionGroup : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete QuestionGroup : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
