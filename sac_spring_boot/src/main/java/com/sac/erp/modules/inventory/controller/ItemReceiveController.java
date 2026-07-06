package com.sac.erp.modules.inventory.controller;

import com.sac.erp.modules.inventory.entity.ItemReceive;
import com.sac.erp.modules.inventory.service.ItemReceiveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/inventory/itemreceive")
@RequiredArgsConstructor
public class ItemReceiveController {

    private final ItemReceiveService service;

    @GetMapping
    public ResponseEntity<List<ItemReceive>> getAll() {
        log.info("REST request to get all ItemReceives");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemReceive> getById(@PathVariable Long id) {
        log.info("REST request to get ItemReceive : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ItemReceive> create(@RequestBody ItemReceive entity) {
        log.info("REST request to create ItemReceive");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemReceive> update(@PathVariable Long id, @RequestBody ItemReceive entity) {
        log.info("REST request to update ItemReceive : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete ItemReceive : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
