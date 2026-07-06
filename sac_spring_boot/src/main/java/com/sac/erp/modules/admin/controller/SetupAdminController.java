package com.sac.erp.modules.admin.controller;

import com.sac.erp.modules.admin.entity.SetupAdmin;
import com.sac.erp.modules.admin.service.SetupAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/setupadmin")
@RequiredArgsConstructor
public class SetupAdminController {

    private final SetupAdminService service;

    @GetMapping
    public ResponseEntity<List<SetupAdmin>> getAll() {
        log.info("REST request to get all SetupAdmins");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SetupAdmin> getById(@PathVariable Long id) {
        log.info("REST request to get SetupAdmin : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<SetupAdmin> create(@RequestBody SetupAdmin entity) {
        log.info("REST request to create SetupAdmin");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SetupAdmin> update(@PathVariable Long id, @RequestBody SetupAdmin entity) {
        log.info("REST request to update SetupAdmin : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete SetupAdmin : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
