package com.sac.erp.modules.dormitory.controller;

import com.sac.erp.modules.dormitory.entity.HostelVisitor;
import com.sac.erp.modules.dormitory.service.HostelVisitorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/dormitory/hostelvisitor")
@RequiredArgsConstructor
public class HostelVisitorController {

    private final HostelVisitorService service;

    @GetMapping
    public ResponseEntity<List<HostelVisitor>> getAll() {
        log.info("REST request to get all HostelVisitors");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelVisitor> getById(@PathVariable Long id) {
        log.info("REST request to get HostelVisitor : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<HostelVisitor> create(@RequestBody HostelVisitor entity) {
        log.info("REST request to create HostelVisitor");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelVisitor> update(@PathVariable Long id, @RequestBody HostelVisitor entity) {
        log.info("REST request to update HostelVisitor : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete HostelVisitor : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
