package com.sac.erp.modules.inventory.controller;

import com.sac.erp.modules.inventory.entity.ItemSellChild;
import com.sac.erp.modules.inventory.service.ItemSellChildService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/inventory/itemsellchild")
@RequiredArgsConstructor
public class ItemSellChildController {

    private final ItemSellChildService service;

    @GetMapping
    public ResponseEntity<List<ItemSellChild>> getAll() {
        log.info("REST request to get all ItemSellChilds");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemSellChild> getById(@PathVariable Long id) {
        log.info("REST request to get ItemSellChild : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ItemSellChild> create(@RequestBody ItemSellChild entity) {
        log.info("REST request to create ItemSellChild");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemSellChild> update(@PathVariable Long id, @RequestBody ItemSellChild entity) {
        log.info("REST request to update ItemSellChild : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete ItemSellChild : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
