package com.sac.erp.modules.inventory.controller;

import com.sac.erp.modules.inventory.entity.ItemSell;
import com.sac.erp.modules.inventory.service.ItemSellService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/inventory/itemsell")
@RequiredArgsConstructor
public class ItemSellController {

    private final ItemSellService service;

    @GetMapping
    public ResponseEntity<List<ItemSell>> getAll() {
        log.info("REST request to get all ItemSells");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemSell> getById(@PathVariable Long id) {
        log.info("REST request to get ItemSell : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ItemSell> create(@RequestBody ItemSell entity) {
        log.info("REST request to create ItemSell");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemSell> update(@PathVariable Long id, @RequestBody ItemSell entity) {
        log.info("REST request to update ItemSell : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete ItemSell : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
