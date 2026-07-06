package com.sac.erp.modules.canteen.controller;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.service.CanteenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/canteen")
@RequiredArgsConstructor
public class CanteenController {

    private final CanteenService canteenService;

    // Categories
    @GetMapping("/categories")
    public ResponseEntity<List<CanteenCategory>> getCategories() {
        return ResponseEntity.ok(canteenService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<CanteenCategory> createCategory(@RequestBody CanteenCategory category) {
        return ResponseEntity.ok(canteenService.saveCategory(category));
    }

    // Items
    @GetMapping("/items")
    public ResponseEntity<List<CanteenItem>> getItems() {
        return ResponseEntity.ok(canteenService.getAllItems());
    }

    @PostMapping("/items")
    public ResponseEntity<CanteenItem> createItem(@RequestBody CanteenItem item) {
        return ResponseEntity.ok(canteenService.saveItem(item));
    }

    // Suppliers
    @GetMapping("/suppliers")
    public ResponseEntity<List<CanteenSupplier>> getSuppliers() {
        return ResponseEntity.ok(canteenService.getAllSuppliers());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<CanteenSupplier> createSupplier(@RequestBody CanteenSupplier supplier) {
        return ResponseEntity.ok(canteenService.saveSupplier(supplier));
    }

    // Inventory
    @GetMapping("/inventory/{itemId}")
    public ResponseEntity<CanteenInventory> getInventory(@PathVariable Long itemId) {
        return ResponseEntity.ok(canteenService.getInventoryByItemId(itemId));
    }

    @PostMapping("/inventory")
    public ResponseEntity<CanteenInventory> updateInventory(@RequestBody CanteenInventory inventory) {
        return ResponseEntity.ok(canteenService.saveInventory(inventory));
    }

    // Wallet
    @GetMapping("/wallet/{studentId}")
    public ResponseEntity<CanteenWallet> getWallet(@PathVariable Long studentId) {
        CanteenWallet wallet = canteenService.getWalletByStudentId(studentId);
        if (wallet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/wallet/recharge")
    public ResponseEntity<CanteenWallet> rechargeWallet(
            @RequestParam Long studentId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false, defaultValue = "cash") String paymentMethod,
            @RequestParam(required = false, defaultValue = "admin") String rechargedBy,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(canteenService.rechargeWallet(studentId, amount, paymentMethod, rechargedBy, notes));
    }

    // Restrictions
    @GetMapping("/restrictions/{studentId}")
    public ResponseEntity<List<CanteenRestriction>> getRestrictions(@PathVariable Long studentId) {
        return ResponseEntity.ok(canteenService.getRestrictionsByStudent(studentId));
    }

    @PostMapping("/restrictions")
    public ResponseEntity<CanteenRestriction> createRestriction(@RequestBody CanteenRestriction restriction) {
        return ResponseEntity.ok(canteenService.saveRestriction(restriction));
    }

    // Transactions & Purchase
    @PostMapping("/purchase")
    public ResponseEntity<CanteenTransaction> purchaseItem(
            @RequestParam Long studentId,
            @RequestParam Long itemId,
            @RequestParam(required = false, defaultValue = "1") int quantity,
            @RequestParam(required = false, defaultValue = "wallet") String paymentMethod,
            @RequestParam(required = false) String notes) {
        try {
            CanteenTransaction transaction = canteenService.purchaseItem(studentId, itemId, quantity, paymentMethod, notes);
            return ResponseEntity.ok(transaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/transactions/{studentId}")
    public ResponseEntity<List<CanteenTransaction>> getTransactions(@PathVariable Long studentId) {
        return ResponseEntity.ok(canteenService.getTransactionsByStudent(studentId));
    }

    // Daily Sales Reports
    @GetMapping("/sales")
    public ResponseEntity<List<CanteenDailySale>> getDailySales() {
        return ResponseEntity.ok(canteenService.getAllDailySales());
    }
}
