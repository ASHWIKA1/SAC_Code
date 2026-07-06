package com.sac.erp.modules.inventory.controller;

import com.sac.erp.modules.inventory.entity.ItemReceiveChild;
import com.sac.erp.modules.inventory.service.ItemReceiveChildService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/inventory/itemreceivechild")
@RequiredArgsConstructor
public class ItemReceiveChildController {

    private final ItemReceiveChildService service;

    @GetMapping
    public ResponseEntity<List<ItemReceiveChild>> getAll() {
        log.info("REST request to get all ItemReceiveChilds");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemReceiveChild> getById(@PathVariable Long id) {
        log.info("REST request to get ItemReceiveChild : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ItemReceiveChild> create(@RequestBody ItemReceiveChild entity) {
        log.info("REST request to create ItemReceiveChild");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemReceiveChild> update(@PathVariable Long id, @RequestBody ItemReceiveChild entity) {
        log.info("REST request to update ItemReceiveChild : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete ItemReceiveChild : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
