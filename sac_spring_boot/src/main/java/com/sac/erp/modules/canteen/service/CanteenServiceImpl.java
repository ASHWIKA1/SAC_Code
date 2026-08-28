package com.sac.erp.modules.canteen.service;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.canteen.controller.KdsWebSocketHandler;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CanteenServiceImpl implements CanteenService {

    private final CanteenCategoryRepository categoryRepository;
    private final CanteenItemRepository itemRepository;
    private final CanteenSupplierRepository supplierRepository;
    private final CanteenInventoryRepository inventoryRepository;
    private final CanteenWalletRepository walletRepository;
    private final CanteenRestrictionRepository restrictionRepository;
    private final CanteenTransactionRepository transactionRepository;
    private final CanteenDailySaleRepository dailySaleRepository;
    private final StudentRepository studentRepository;
    private final RealtimeEventPublisher realtimeEventPublisher;

    private final CanteenOrderItemRepository orderItemRepository;
    private final CanteenRawMaterialRepository rawMaterialRepository;
    private final CanteenRecipeBomRepository recipeBomRepository;
    private final KdsWebSocketHandler webSocketHandler;
    private final CanteenAuditLogRepository auditLogRepository;

    @Override
    public List<CanteenCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public CanteenCategory saveCategory(CanteenCategory category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<CanteenItem> getAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public CanteenItem saveItem(CanteenItem item) {
        CanteenItem saved = itemRepository.save(item);
        webSocketHandler.sendEvent("STOCK_UPDATED", saved);
        return saved;
    }

    @Override
    public List<CanteenSupplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public CanteenSupplier saveSupplier(CanteenSupplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public CanteenInventory getInventoryByItemId(Long itemId) {
        return inventoryRepository.findByItemId(itemId).orElse(null);
    }

    @Override
    public CanteenInventory saveInventory(CanteenInventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public CanteenWallet getWalletByStudentId(Long studentId) {
        return walletRepository.findByStudentId(studentId).orElse(null);
    }

    @Override
    public CanteenWallet getWalletByRfid(String rfid) {
        return walletRepository.findByRfidCardUid(rfid).orElse(null);
    }

    @Override
    public CanteenWallet saveWallet(CanteenWallet wallet) {
        return walletRepository.save(wallet);
    }

    @Override
    @Transactional
    public CanteenWallet rechargeWallet(Long studentId, BigDecimal amount, String paymentMethod, String rechargedBy, String notes) {
        CanteenWallet wallet = walletRepository.findByStudentIdForUpdate(studentId)
            .orElseGet(() -> {
                CanteenWallet cw = new CanteenWallet();
                cw.setStudentId(studentId);
                return cw;
            });

        if (wallet.getIsActive() == null) {
            wallet.setIsActive(1);
        }
        if (wallet.getIsActive() != 1) {
            throw new IllegalArgumentException("Cannot recharge an inactive wallet");
        }

        BigDecimal oldBalance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        BigDecimal newBalance = oldBalance.add(amount);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        CanteenAuditLog auditLog = new CanteenAuditLog();
        auditLog.setOldBalance(oldBalance);
        auditLog.setNewBalance(newBalance);
        auditLog.setStudentId(studentId);
        auditLog.setAmount(amount);
        auditLog.setReasonCode("RECHARGE");
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(auditLog);

        // Log transaction
        CanteenTransaction transaction = new CanteenTransaction();
        transaction.setWallet(wallet);
        transaction.setStudentId(studentId);
        transaction.setType(CanteenTransaction.TransactionType.recharge);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(newBalance);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setRechargedBy(rechargedBy);
        transaction.setNotes(notes);
        transactionRepository.save(transaction);

        realtimeEventPublisher.publish("WALLET_UPDATE", wallet);
        webSocketHandler.sendEvent("WALLET_BALANCE_UPDATED", wallet);

        return wallet;
    }

    @Override
    public List<CanteenRestriction> getRestrictionsByStudent(Long studentId) {
        return restrictionRepository.findByStudentIdAndIsActive(studentId, 1);
    }

    @Override
    public CanteenRestriction saveRestriction(CanteenRestriction restriction) {
        return restrictionRepository.save(restriction);
    }

    @Override
    @Transactional
    public CanteenTransaction purchaseItem(Long studentId, Long itemId, int quantity, String paymentMethod, String notes) {
        CanteenItem item = itemRepository.findById(itemId)
            .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (item.getIsAvailable() != 1) {
            throw new IllegalArgumentException("Item is not available");
        }

        CanteenWallet wallet = walletRepository.findByStudentIdForUpdate(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Canteen wallet not found for student"));

        if (wallet.getIsActive() != 1) {
            throw new IllegalArgumentException("Canteen wallet is inactive");
        }

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student record not found"));
        if (student.getActiveStatus() != 1) {
            throw new IllegalArgumentException("Student is suspended or inactive");
        }

        BigDecimal totalCost = item.getPrice().multiply(BigDecimal.valueOf(quantity));

        // Enforce active category/item blocks
        List<CanteenRestriction> restrictions = restrictionRepository.findByStudentIdAndIsActive(studentId, 1);
        for (CanteenRestriction restriction : restrictions) {
            if (restriction.getRestrictionType() == CanteenRestriction.RestrictionType.item_block
                && itemId.equals(restriction.getItemId())) {
                throw new IllegalArgumentException("Item is blocked for this student: " + item.getItemName());
            }
            if (restriction.getRestrictionType() == CanteenRestriction.RestrictionType.category_block
                && item.getCategory().getId().equals(restriction.getCategoryId())) {
                throw new IllegalArgumentException("Category is blocked for this student: " + item.getCategory().getName());
            }
        }

        // Enforce daily spending limit
        LocalDate today = LocalDate.now();
        BigDecimal spentToday = transactionRepository.findByWalletId(wallet.getId()).stream()
            .filter(t -> t.getType() == CanteenTransaction.TransactionType.purchase 
                && t.getCreatedAt() != null && t.getCreatedAt().toLocalDate().isEqual(today))
            .map(CanteenTransaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (spentToday.add(totalCost).compareTo(wallet.getDailyLimit()) > 0) {
            throw new IllegalArgumentException("Daily spend limit exceeded.");
        }

        // Enforce wallet balance
        if (wallet.getBalance().compareTo(totalCost) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance");
        }

        // Deduct balance
        BigDecimal oldBalance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        BigDecimal newBalance = oldBalance.subtract(totalCost);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        CanteenAuditLog auditLog = new CanteenAuditLog();
        auditLog.setOldBalance(oldBalance);
        auditLog.setNewBalance(newBalance);
        auditLog.setStudentId(studentId);
        auditLog.setAmount(totalCost);
        auditLog.setReasonCode("PURCHASE");
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(auditLog);

        // Record Transaction
        CanteenTransaction transaction = new CanteenTransaction();
        transaction.setWallet(wallet);
        transaction.setStudentId(studentId);
        transaction.setType(CanteenTransaction.TransactionType.purchase);
        transaction.setAmount(totalCost);
        transaction.setBalanceAfter(newBalance);
        transaction.setItemId(itemId);
        transaction.setQuantity(quantity);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setNotes(notes);
        CanteenTransaction savedTransaction = transactionRepository.save(transaction);

        // Update Daily Sales
        CanteenDailySale dailySale = dailySaleRepository.findBySaleDate(today)
            .orElseGet(() -> {
                CanteenDailySale ds = new CanteenDailySale();
                ds.setSaleDate(today);
                return ds;
            });
        dailySale.setTotalTransactions(dailySale.getTotalTransactions() + 1);
        dailySale.setTotalRevenue(dailySale.getTotalRevenue().add(totalCost));
        BigDecimal cost = item.getCostPrice().multiply(BigDecimal.valueOf(quantity));
        dailySale.setTotalCost(dailySale.getTotalCost().add(cost));
        dailySale.setTotalProfit(dailySale.getTotalRevenue().subtract(dailySale.getTotalCost()));
        dailySaleRepository.save(dailySale);

        return savedTransaction;
    }

    @Override
    public List<CanteenTransaction> getTransactionsByStudent(Long studentId) {
        return transactionRepository.findByStudentId(studentId);
    }

    @Override
    public List<CanteenDailySale> getAllDailySales() {
        return dailySaleRepository.findAll();
    }

    @Override
    @Transactional
    public void depleteRecipeIngredients(Long orderId) {
        List<CanteenOrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (CanteenOrderItem orderItem : items) {
            Long itemId = orderItem.getMenuItemId();
            int qty = orderItem.getQuantity();

            // Fetch BOM
            List<CanteenRecipeBom> boms = recipeBomRepository.findByMenuItemId(itemId);
            for (CanteenRecipeBom bom : boms) {
                CanteenRawMaterial material = rawMaterialRepository.findById(bom.getRawMaterialId())
                        .orElseThrow(() -> new IllegalStateException("Raw material not found for BOM ID: " + bom.getId()));

                BigDecimal required = bom.getRequiredQuantityPerUnit().multiply(BigDecimal.valueOf(qty));
                BigDecimal current = material.getCurrentStockQuantity();

                if (current.compareTo(required) < 0) {
                    material.setCurrentStockQuantity(BigDecimal.ZERO);
                } else {
                    material.setCurrentStockQuantity(current.subtract(required));
                }
                rawMaterialRepository.save(material);
            }

            // Auto Toggle out of stock if item stock drops
            CanteenItem menuItem = itemRepository.findById(itemId).orElse(null);
            if (menuItem != null && !menuItem.getIsUnlimited()) {
                BigDecimal currentStock = menuItem.getStockQuantity();
                BigDecimal orderQty = BigDecimal.valueOf(qty);
                if (currentStock.compareTo(orderQty) < 0) {
                    menuItem.setStockQuantity(BigDecimal.ZERO);
                    menuItem.setIsOutOfStock(true);
                } else {
                    menuItem.setStockQuantity(currentStock.subtract(orderQty));
                    if (menuItem.getStockQuantity().compareTo(menuItem.getLowStockThreshold()) <= 0) {
                        menuItem.setIsOutOfStock(true);
                    }
                }
                itemRepository.save(menuItem);
                webSocketHandler.sendEvent("STOCK_UPDATED", menuItem);
            }
        }
        webSocketHandler.sendEvent("STOCK_UPDATED", "depleted");
    }
}
