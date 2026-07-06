package com.sac.erp.modules.fees.controller;

import com.sac.erp.modules.fees.entity.FeesAssign;
import com.sac.erp.modules.fees.service.FeesAssignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fees/feesassign")
@RequiredArgsConstructor
public class FeesAssignController {

    private final FeesAssignService service;

    @GetMapping
    public ResponseEntity<List<FeesAssign>> getAll() {
        log.info("REST request to get all FeesAssigns");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeesAssign> getById(@PathVariable Long id) {
        log.info("REST request to get FeesAssign : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FeesAssign> create(@RequestBody FeesAssign entity) {
        log.info("REST request to create FeesAssign");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeesAssign> update(@PathVariable Long id, @RequestBody FeesAssign entity) {
        log.info("REST request to update FeesAssign : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete FeesAssign : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
