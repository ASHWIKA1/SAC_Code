package com.sac.erp.modules.canteen.service;

import com.sac.erp.modules.canteen.entity.*;
import java.math.BigDecimal;
import java.util.List;

public interface CanteenService {
    // Categories
    List<CanteenCategory> getAllCategories();
    CanteenCategory saveCategory(CanteenCategory category);

    // Items
    List<CanteenItem> getAllItems();
    CanteenItem saveItem(CanteenItem item);

    // Suppliers
    List<CanteenSupplier> getAllSuppliers();
    CanteenSupplier saveSupplier(CanteenSupplier supplier);

    // Inventory
    CanteenInventory getInventoryByItemId(Long itemId);
    CanteenInventory saveInventory(CanteenInventory inventory);

    // Wallet
    CanteenWallet getWalletByStudentId(Long studentId);
    CanteenWallet getWalletByRfid(String rfid);
    CanteenWallet saveWallet(CanteenWallet wallet);
    CanteenWallet rechargeWallet(Long studentId, BigDecimal amount, String paymentMethod, String rechargedBy, String notes);

    // Restrictions
    List<CanteenRestriction> getRestrictionsByStudent(Long studentId);
    CanteenRestriction saveRestriction(CanteenRestriction restriction);

    // Transactions / Purchase
    CanteenTransaction purchaseItem(Long studentId, Long itemId, int quantity, String paymentMethod, String notes);
    List<CanteenTransaction> getTransactionsByStudent(Long studentId);

    // Sales Reports
    List<CanteenDailySale> getAllDailySales();
}
