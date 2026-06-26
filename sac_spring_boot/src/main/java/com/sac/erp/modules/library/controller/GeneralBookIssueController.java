package com.sac.erp.modules.library.controller;

import com.sac.erp.modules.library.entity.GeneralBookIssue;
import com.sac.erp.modules.library.service.GeneralBookIssueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/library/generalbookissue")
@RequiredArgsConstructor
public class GeneralBookIssueController {

    private final GeneralBookIssueService service;

    @GetMapping
    public ResponseEntity<List<GeneralBookIssue>> getAll() {
        log.info("REST request to get all GeneralBookIssues");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneralBookIssue> getById(@PathVariable Long id) {
        log.info("REST request to get GeneralBookIssue : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<GeneralBookIssue> create(@RequestBody GeneralBookIssue entity) {
        log.info("REST request to create GeneralBookIssue");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeneralBookIssue> update(@PathVariable Long id, @RequestBody GeneralBookIssue entity) {
        log.info("REST request to update GeneralBookIssue : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete GeneralBookIssue : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
