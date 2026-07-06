package com.sac.erp.modules.admin.controller;

import com.sac.erp.modules.admin.entity.PhoneCallLog;
import com.sac.erp.modules.admin.service.PhoneCallLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/phonecalllog")
@RequiredArgsConstructor
public class PhoneCallLogController {

    private final PhoneCallLogService service;

    @GetMapping
    public ResponseEntity<List<PhoneCallLog>> getAll() {
        log.info("REST request to get all PhoneCallLogs");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhoneCallLog> getById(@PathVariable Long id) {
        log.info("REST request to get PhoneCallLog : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PhoneCallLog> create(@RequestBody PhoneCallLog entity) {
        log.info("REST request to create PhoneCallLog");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhoneCallLog> update(@PathVariable Long id, @RequestBody PhoneCallLog entity) {
        log.info("REST request to update PhoneCallLog : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete PhoneCallLog : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
