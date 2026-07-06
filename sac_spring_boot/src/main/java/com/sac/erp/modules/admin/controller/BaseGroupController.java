package com.sac.erp.modules.admin.controller;

import com.sac.erp.modules.admin.entity.BaseGroup;
import com.sac.erp.modules.admin.service.BaseGroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/basegroup")
@RequiredArgsConstructor
public class BaseGroupController {

    private final BaseGroupService service;

    @GetMapping
    public ResponseEntity<List<BaseGroup>> getAll() {
        log.info("REST request to get all BaseGroups");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseGroup> getById(@PathVariable Long id) {
        log.info("REST request to get BaseGroup : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BaseGroup> create(@RequestBody BaseGroup entity) {
        log.info("REST request to create BaseGroup");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseGroup> update(@PathVariable Long id, @RequestBody BaseGroup entity) {
        log.info("REST request to update BaseGroup : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete BaseGroup : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
