package com.sac.erp.modules.canteen.service;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
        return itemRepository.save(item);
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
        CanteenWallet wallet = walletRepository.findByStudentId(studentId)
            .orElseGet(() -> {
                CanteenWallet cw = new CanteenWallet();
                cw.setStudentId(studentId);
                return cw;
            });

        if (wallet.getIsActive() != 1) {
            throw new IllegalArgumentException("Cannot recharge an inactive wallet");
        }

        BigDecimal newBalance = wallet.getBalance().add(amount);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

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

        CanteenWallet wallet = walletRepository.findByStudentId(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Canteen wallet not found for student"));

        if (wallet.getIsActive() != 1) {
            throw new IllegalArgumentException("Canteen wallet is inactive");
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
            throw new IllegalArgumentException("Daily spend limit exceeded. Spent today: " + spentToday + ", Purchase cost: " + totalCost + ", Limit: " + wallet.getDailyLimit());
        }

        // Enforce wallet balance
        if (wallet.getBalance().compareTo(totalCost) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance");
        }

        // Enforce inventory stock levels
        CanteenInventory inventory = inventoryRepository.findByItemId(itemId)
            .orElseThrow(() -> new IllegalArgumentException("Inventory record not found for this item"));
        if (inventory.getStockQuantity().compareTo(BigDecimal.valueOf(quantity)) < 0) {
            throw new IllegalArgumentException("Insufficient inventory stock");
        }

        // Deduct balance and update inventory
        BigDecimal newBalance = wallet.getBalance().subtract(totalCost);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        inventory.setStockQuantity(inventory.getStockQuantity().subtract(BigDecimal.valueOf(quantity)));
        inventoryRepository.save(inventory);

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
}
