package com.sac.erp.modules.inventory.controller;

import com.sac.erp.modules.inventory.entity.*;
import com.sac.erp.modules.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/categories")
    public ResponseEntity<List<ItemCategory>> getItemCategories() {
        log.info("REST request to get all active item categories");
        return ResponseEntity.ok(inventoryService.getAllItemCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<ItemCategory> createItemCategory(@RequestBody ItemCategory category) {
        log.info("REST request to define item category: {}", category.getCategoryName());
        return ResponseEntity.ok(inventoryService.createItemCategory(category));
    }

    @GetMapping("/stores")
    public ResponseEntity<List<ItemStore>> getItemStores() {
        log.info("REST request to get all active item stores");
        return ResponseEntity.ok(inventoryService.getAllItemStores());
    }

    @PostMapping("/stores")
    public ResponseEntity<ItemStore> createItemStore(@RequestBody ItemStore store) {
        log.info("REST request to configure store: {}", store.getStoreName());
        return ResponseEntity.ok(inventoryService.createItemStore(store));
    }

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getItems() {
        log.info("REST request to get all active items");
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @PostMapping("/items")
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        log.info("REST request to define item: {}", item.getItemName());
        return ResponseEntity.ok(inventoryService.createItem(item));
    }

    @PostMapping("/items/issue")
    public ResponseEntity<ItemIssue> issueItem(
            @RequestParam Long itemId,
            @RequestParam Long userId,
            @RequestParam Long roleId,
            @RequestParam(required = false) Integer quantity) {
        log.info("REST request to issue item ID: {} to user: {}", itemId, userId);
        return ResponseEntity.ok(inventoryService.issueItem(itemId, userId, roleId, quantity));
    }

    @PostMapping("/items/return/{issueId}")
    public ResponseEntity<ItemIssue> returnItem(@PathVariable Long issueId) {
        log.info("REST request to return item for issue ID: {}", issueId);
        return ResponseEntity.ok(inventoryService.returnItem(issueId));
    }

    @GetMapping("/issues/user/{userId}")
    public ResponseEntity<List<ItemIssue>> getIssuesByUser(@PathVariable Long userId) {
        log.info("REST request to get all item checkouts for user: {}", userId);
        return ResponseEntity.ok(inventoryService.getIssuesByUser(userId));
    }
}
