package com.sac.erp.modules.dormitory.controller;

import com.sac.erp.modules.dormitory.entity.Hostel;
import com.sac.erp.modules.dormitory.service.HostelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/dormitory/hostel")
@RequiredArgsConstructor
public class HostelController {

    private final HostelService service;

    @GetMapping
    public ResponseEntity<List<Hostel>> getAll() {
        log.info("REST request to get all Hostels");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hostel> getById(@PathVariable Long id) {
        log.info("REST request to get Hostel : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<Hostel> create(@RequestBody Hostel entity) {
        log.info("REST request to create Hostel");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hostel> update(@PathVariable Long id, @RequestBody Hostel entity) {
        log.info("REST request to update Hostel : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete Hostel : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
