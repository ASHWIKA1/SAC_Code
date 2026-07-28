package com.sac.erp.modules.canteen.controller;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.repository.*;
import com.sac.erp.modules.canteen.service.CanteenEventPublisher;
import com.sac.erp.modules.canteen.service.CanteenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/canteen")
@RequiredArgsConstructor
public class CanteenController {

    private final CanteenService canteenService;
    private final CanteenEventPublisher eventPublisher;
    private final CanteenTransactionRepository transactionRepository;
    private final CanteenWalletRepository walletRepository;
    private final CanteenInventoryRepository inventoryRepository;
    private final CanteenItemRepository itemRepository;
    private final CanteenCategoryRepository categoryRepository;
    private final CanteenRestrictionRepository restrictionRepository;
    private final CanteenDailySaleRepository dailySaleRepository;

    // SSE Realtime Subscription
    @GetMapping("/realtime/stream")
    public SseEmitter streamEvents() {
        return eventPublisher.subscribe();
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        LocalDate today = LocalDate.now();

        List<CanteenTransaction> allTransactions = transactionRepository.findAll();
        List<CanteenTransaction> todayPurchases = allTransactions.stream()
                .filter(t -> t.getType() == CanteenTransaction.TransactionType.purchase
                        && t.getCreatedAt() != null
                        && t.getCreatedAt().toLocalDate().isEqual(today))
                .collect(Collectors.toList());

        BigDecimal todayRevenue = todayPurchases.stream()
                .map(CanteenTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long completedOrders = todayPurchases.size();

        long activeWallets = walletRepository.findAll().stream()
                .filter(w -> w.getIsActive() != null && w.getIsActive() == 1)
                .count();

        long lowStockAlerts = inventoryRepository.findAll().stream()
                .filter(i -> i.getStockQuantity() != null && i.getStockQuantity().compareTo(BigDecimal.valueOf(10)) < 0)
                .count();

        // Build recent activities ticker list
        List<Map<String, Object>> recentActivities = allTransactions.stream()
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(10)
                .map(t -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", t.getId());
                    act.put("type", t.getType().name());
                    act.put("amount", t.getAmount());
                    act.put("timestamp", t.getCreatedAt());
                    act.put("studentId", t.getStudentId());
                    act.put("notes", t.getNotes());
                    return act;
                })
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("todayRevenue", todayRevenue);
        stats.put("completedOrders", completedOrders);
        stats.put("activeWallets", activeWallets);
        stats.put("lowStockAlerts", lowStockAlerts);
        stats.put("recentActivities", recentActivities);

        return ResponseEntity.ok(stats);
    }

    // Categories with schedules support
    @GetMapping("/categories")
    public ResponseEntity<List<CanteenCategory>> getCategories() {
        return ResponseEntity.ok(canteenService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<CanteenCategory> createCategory(@RequestBody CanteenCategory category) {
        CanteenCategory saved = canteenService.saveCategory(category);
        eventPublisher.publish("CATEGORY_UPDATE", saved);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        eventPublisher.publish("CATEGORY_DELETE", id);
        return ResponseEntity.ok().build();
    }

    // Menu Items
    @GetMapping("/items")
    public ResponseEntity<List<Map<String, Object>>> getItems() {
        List<CanteenItem> items = canteenService.getAllItems();
        List<Map<String, Object>> itemsWithStock = items.stream().map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("itemName", item.getItemName());
            map.put("itemCode", item.getItemCode());
            map.put("description", item.getDescription());
            map.put("price", item.getPrice());
            map.put("costPrice", item.getCostPrice());
            map.put("unit", item.getUnit());
            map.put("isAvailable", item.getIsAvailable());
            map.put("isVegetarian", item.getIsVegetarian());
            map.put("calories", item.getCalories());
            map.put("image", item.getImage());
            map.put("schoolId", item.getSchoolId());
            if (item.getCategory() != null) {
                map.put("categoryId", item.getCategory().getId());
                map.put("categoryName", item.getCategory().getName());
            }

            // Fetch stock quantity
            BigDecimal stock = inventoryRepository.findByItemId(item.getId())
                    .map(CanteenInventory::getStockQuantity)
                    .orElse(BigDecimal.ZERO);
            map.put("stock", stock);

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(itemsWithStock);
    }

    @PostMapping("/items")
    public ResponseEntity<CanteenItem> createItem(@RequestBody Map<String, Object> payload) {
        CanteenItem item = new CanteenItem();
        if (payload.containsKey("id") && payload.get("id") != null) {
            item.setId(Long.valueOf(payload.get("id").toString()));
        }
        item.setItemName((String) payload.get("itemName"));
        item.setItemCode((String) payload.get("itemCode"));
        item.setDescription((String) payload.get("description"));
        item.setPrice(new BigDecimal(payload.get("price").toString()));
        item.setCostPrice(payload.containsKey("costPrice") ? new BigDecimal(payload.get("costPrice").toString()) : BigDecimal.ZERO);
        item.setUnit(payload.containsKey("unit") ? (String) payload.get("unit") : "piece");
        item.setIsAvailable(payload.containsKey("isAvailable") ? Integer.valueOf(payload.get("isAvailable").toString()) : 1);
        item.setIsVegetarian(payload.containsKey("isVegetarian") ? Integer.valueOf(payload.get("isVegetarian").toString()) : 1);
        item.setImage((String) payload.get("image"));

        if (payload.containsKey("categoryId")) {
            Long catId = Long.valueOf(payload.get("categoryId").toString());
            categoryRepository.findById(catId).ifPresent(item::setCategory);
        }

        CanteenItem saved = canteenService.saveItem(item);

        // Update inventory/stock
        BigDecimal initialStock = payload.containsKey("stock") ? new BigDecimal(payload.get("stock").toString()) : BigDecimal.ZERO;
        CanteenInventory inv = inventoryRepository.findByItemId(saved.getId()).orElseGet(() -> {
            CanteenInventory i = new CanteenInventory();
            i.setItem(saved);
            return i;
        });
        inv.setStockQuantity(initialStock);
        inventoryRepository.save(inv);

        eventPublisher.publish("ITEM_UPDATE", saved);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemRepository.deleteById(id);
        inventoryRepository.findByItemId(id).ifPresent(inventoryRepository::delete);
        eventPublisher.publish("ITEM_DELETE", id);
        return ResponseEntity.ok().build();
    }

    // Toggle Item availability status
    @PostMapping("/items/{id}/toggle-status")
    public ResponseEntity<CanteenItem> toggleItemStatus(@PathVariable Long id) {
        CanteenItem item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        item.setIsAvailable(item.getIsAvailable() == 1 ? 0 : 1);
        CanteenItem saved = itemRepository.save(item);
        eventPublisher.publish("ITEM_UPDATE", saved);
        return ResponseEntity.ok(saved);
    }

    // Wallets Management
    @GetMapping("/wallets")
    public ResponseEntity<List<CanteenWallet>> getWallets() {
        return ResponseEntity.ok(walletRepository.findAll());
    }

    @PostMapping("/wallets")
    public ResponseEntity<CanteenWallet> saveWallet(@RequestBody CanteenWallet wallet) {
        if (wallet.getBalance() == null) {
            wallet.setBalance(BigDecimal.ZERO);
        }
        if (wallet.getDailyLimit() == null) {
            wallet.setDailyLimit(BigDecimal.valueOf(100.00));
        }
        if (wallet.getIsActive() == null) {
            wallet.setIsActive(1);
        }
        CanteenWallet saved = canteenService.saveWallet(wallet);
        eventPublisher.publish("WALLET_UPDATE", saved);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/wallets/{studentId}/recharge")
    public ResponseEntity<CanteenWallet> rechargeWallet(
            @PathVariable Long studentId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false, defaultValue = "cash") String paymentMethod,
            @RequestParam(required = false, defaultValue = "admin") String rechargedBy,
            @RequestParam(required = false) String notes) {
        CanteenWallet wallet = canteenService.rechargeWallet(studentId, amount, paymentMethod, rechargedBy, notes);
        eventPublisher.publish("WALLET_UPDATE", wallet);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/wallets/{studentId}/toggle-active")
    public ResponseEntity<CanteenWallet> toggleWalletActive(@PathVariable Long studentId) {
        CanteenWallet wallet = walletRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
        wallet.setIsActive(wallet.getIsActive() == 1 ? 0 : 1);
        CanteenWallet saved = walletRepository.save(wallet);
        eventPublisher.publish("WALLET_UPDATE", saved);
        return ResponseEntity.ok(saved);
    }

    // Restrictions
    @GetMapping("/restrictions/{studentId}")
    public ResponseEntity<List<CanteenRestriction>> getRestrictions(@PathVariable Long studentId) {
        return ResponseEntity.ok(canteenService.getRestrictionsByStudent(studentId));
    }

    @PostMapping("/restrictions")
    public ResponseEntity<CanteenRestriction> createRestriction(@RequestBody CanteenRestriction restriction) {
        CanteenRestriction saved = canteenService.saveRestriction(restriction);
        eventPublisher.publish("RESTRICTION_UPDATE", saved);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/restrictions/{id}")
    public ResponseEntity<Void> deleteRestriction(@PathVariable Long id) {
        restrictionRepository.deleteById(id);
        eventPublisher.publish("RESTRICTION_DELETE", id);
        return ResponseEntity.ok().build();
    }

    // POS Checkout with validation rules
    @PostMapping("/pos/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> checkoutData) {
        try {
            Long studentId = Long.valueOf(checkoutData.get("studentId").toString());
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) checkoutData.get("items");
            String paymentMethod = checkoutData.containsKey("paymentMethod") ? (String) checkoutData.get("paymentMethod") : "wallet";
            String notes = (String) checkoutData.get("notes");

            CanteenWallet wallet = walletRepository.findByStudentId(studentId)
                    .orElseThrow(() -> new IllegalArgumentException("Canteen wallet not found for student"));

            if (wallet.getIsActive() != 1) {
                return ResponseEntity.badRequest().body(Map.of("message", "Wallet is locked/inactive"));
            }

            BigDecimal totalCost = BigDecimal.ZERO;
            LocalDate today = LocalDate.now();

            // Fetch restrictions
            List<CanteenRestriction> restrictions = restrictionRepository.findByStudentIdAndIsActive(studentId, 1);

            for (Map<String, Object> cartItem : cartItems) {
                Long itemId = Long.valueOf(cartItem.get("id").toString());
                int qty = Integer.parseInt(cartItem.get("quantity").toString());

                CanteenItem item = itemRepository.findById(itemId)
                        .orElseThrow(() -> new IllegalArgumentException("Item not found"));

                if (item.getIsAvailable() != 1) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Item is out of stock / unavailable: " + item.getItemName()));
                }

                // Check blocks
                for (CanteenRestriction restriction : restrictions) {
                    if (restriction.getRestrictionType() == CanteenRestriction.RestrictionType.item_block
                            && itemId.equals(restriction.getItemId())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Allergen / Item restricted for student: " + item.getItemName()));
                    }
                    if (restriction.getRestrictionType() == CanteenRestriction.RestrictionType.category_block
                            && item.getCategory().getId().equals(restriction.getCategoryId())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Category restricted for student: " + item.getCategory().getName()));
                    }
                }

                // Calculate cost
                BigDecimal cost = item.getPrice().multiply(BigDecimal.valueOf(qty));
                totalCost = totalCost.add(cost);

                // Check stock
                CanteenInventory inv = inventoryRepository.findByItemId(itemId)
                        .orElseThrow(() -> new IllegalArgumentException("Inventory record not found"));
                if (inv.getStockQuantity().compareTo(BigDecimal.valueOf(qty)) < 0) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Insufficient stock for: " + item.getItemName()));
                }
            }

            // Check daily limit
            BigDecimal spentToday = transactionRepository.findByWalletId(wallet.getId()).stream()
                    .filter(t -> t.getType() == CanteenTransaction.TransactionType.purchase
                            && t.getCreatedAt() != null && t.getCreatedAt().toLocalDate().isEqual(today))
                    .map(CanteenTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (spentToday.add(totalCost).compareTo(wallet.getDailyLimit()) > 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Daily spend limit exceeded. Remaining limit: " + wallet.getDailyLimit().subtract(spentToday)));
            }

            // Check wallet balance
            if (wallet.getBalance().compareTo(totalCost) < 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Insufficient wallet balance"));
            }

            // Complete purchases
            CanteenTransaction lastTx = null;
            for (Map<String, Object> cartItem : cartItems) {
                Long itemId = Long.valueOf(cartItem.get("id").toString());
                int qty = Integer.parseInt(cartItem.get("quantity").toString());
                lastTx = canteenService.purchaseItem(studentId, itemId, qty, paymentMethod, notes);
            }

            eventPublisher.publish("PURCHASE_COMPLETED", lastTx);
            return ResponseEntity.ok(lastTx);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Transactions History
    @GetMapping("/transactions")
    public ResponseEntity<List<CanteenTransaction>> getTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    // One-click Refund
    @PostMapping("/transactions/{id}/refund")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<CanteenTransaction> refundTransaction(@PathVariable Long id) {
        CanteenTransaction originalTx = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (originalTx.getType() != CanteenTransaction.TransactionType.purchase) {
            throw new IllegalArgumentException("Only purchases can be refunded");
        }

        CanteenWallet wallet = originalTx.getWallet();
        BigDecimal refundedAmount = originalTx.getAmount();

        // 1. Restore wallet balance
        BigDecimal newBalance = wallet.getBalance().add(refundedAmount);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        // 2. Restore item inventory count
        if (originalTx.getItemId() != null) {
            inventoryRepository.findByItemId(originalTx.getItemId()).ifPresent(inv -> {
                inv.setStockQuantity(inv.getStockQuantity().add(BigDecimal.valueOf(originalTx.getQuantity())));
                inventoryRepository.save(inv);
            });
        }

        // 3. Mark transaction as refund
        originalTx.setType(CanteenTransaction.TransactionType.refund);
        originalTx.setBalanceAfter(newBalance);
        CanteenTransaction saved = transactionRepository.save(originalTx);

        // 4. Update daily sale log for today
        LocalDate today = LocalDate.now();
        dailySaleRepository.findBySaleDate(today).ifPresent(dailySale -> {
            dailySale.setTotalRevenue(dailySale.getTotalRevenue().subtract(refundedAmount));
            dailySale.setTotalProfit(dailySale.getTotalRevenue().subtract(dailySale.getTotalCost()));
            dailySaleRepository.save(dailySale);
        });

        eventPublisher.publish("TRANSACTION_REFUND", saved);
        return ResponseEntity.ok(saved);
    }
}
