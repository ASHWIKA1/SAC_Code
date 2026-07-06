package com.sac.erp;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.repository.*;
import com.sac.erp.modules.canteen.service.CanteenServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CanteenServiceTest {

    @Mock private CanteenCategoryRepository categoryRepository;
    @Mock private CanteenItemRepository itemRepository;
    @Mock private CanteenSupplierRepository supplierRepository;
    @Mock private CanteenInventoryRepository inventoryRepository;
    @Mock private CanteenWalletRepository walletRepository;
    @Mock private CanteenRestrictionRepository restrictionRepository;
    @Mock private CanteenTransactionRepository transactionRepository;
    @Mock private CanteenDailySaleRepository dailySaleRepository;

    @InjectMocks
    private CanteenServiceImpl canteenService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRechargeWallet() {
        CanteenWallet wallet = new CanteenWallet();
        wallet.setId(1L);
        wallet.setStudentId(10L);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setIsActive(1);

        when(walletRepository.findByStudentId(10L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(CanteenWallet.class))).thenAnswer(i -> i.getArgument(0));

        CanteenWallet result = canteenService.rechargeWallet(10L, new BigDecimal("50.00"), "cash", "parent", "pocket money");

        assertNotNull(result);
        assertEquals(new BigDecimal("50.00"), result.getBalance());
        verify(walletRepository, times(1)).save(wallet);
        verify(transactionRepository, times(1)).save(any(CanteenTransaction.class));
    }

    @Test
    void testPurchaseItem_Success() {
        CanteenCategory category = new CanteenCategory();
        category.setId(1L);
        category.setName("Meals");

        CanteenItem item = new CanteenItem();
        item.setId(5L);
        item.setItemName("Lunch Box");
        item.setPrice(new BigDecimal("10.00"));
        item.setCostPrice(new BigDecimal("7.00"));
        item.setCategory(category);
        item.setIsAvailable(1);

        CanteenWallet wallet = new CanteenWallet();
        wallet.setId(2L);
        wallet.setStudentId(10L);
        wallet.setBalance(new BigDecimal("30.00"));
        wallet.setDailyLimit(new BigDecimal("50.00"));
        wallet.setIsActive(1);

        CanteenInventory inventory = new CanteenInventory();
        inventory.setItem(item);
        inventory.setStockQuantity(new BigDecimal("5"));

        when(itemRepository.findById(5L)).thenReturn(Optional.of(item));
        when(walletRepository.findByStudentId(10L)).thenReturn(Optional.of(wallet));
        when(restrictionRepository.findByStudentIdAndIsActive(10L, 1)).thenReturn(Collections.emptyList());
        when(transactionRepository.findByWalletId(2L)).thenReturn(Collections.emptyList());
        when(inventoryRepository.findByItemId(5L)).thenReturn(Optional.of(inventory));
        when(transactionRepository.save(any(CanteenTransaction.class))).thenAnswer(i -> i.getArgument(0));
        when(dailySaleRepository.findBySaleDate(any())).thenReturn(Optional.empty());

        CanteenTransaction transaction = canteenService.purchaseItem(10L, 5L, 2, "wallet", "Lunch check");

        assertNotNull(transaction);
        assertEquals(new BigDecimal("20.00"), transaction.getAmount());
        assertEquals(new BigDecimal("10.00"), wallet.getBalance());
        assertEquals(new BigDecimal("3"), inventory.getStockQuantity());
    }

    @Test
    void testPurchaseItem_DailyLimitExceeded() {
        CanteenCategory category = new CanteenCategory();
        category.setId(1L);
        category.setName("Meals");

        CanteenItem item = new CanteenItem();
        item.setId(5L);
        item.setItemName("Lunch Box");
        item.setPrice(new BigDecimal("15.00"));
        item.setCategory(category);
        item.setIsAvailable(1);

        CanteenWallet wallet = new CanteenWallet();
        wallet.setId(2L);
        wallet.setStudentId(10L);
        wallet.setBalance(new BigDecimal("100.00"));
        wallet.setDailyLimit(new BigDecimal("20.00"));
        wallet.setIsActive(1);

        // Previous transactions today
        CanteenTransaction pastTx = new CanteenTransaction();
        pastTx.setType(CanteenTransaction.TransactionType.purchase);
        pastTx.setAmount(new BigDecimal("10.00"));
        // Set creation timestamp as today
        pastTx.setCreatedAt(LocalDateTime.now());

        when(itemRepository.findById(5L)).thenReturn(Optional.of(item));
        when(walletRepository.findByStudentId(10L)).thenReturn(Optional.of(wallet));
        when(restrictionRepository.findByStudentIdAndIsActive(10L, 1)).thenReturn(Collections.emptyList());
        when(transactionRepository.findByWalletId(2L)).thenReturn(List.of(pastTx));

        assertThrows(IllegalArgumentException.class, () -> {
            canteenService.purchaseItem(10L, 5L, 1, "wallet", "Should fail");
        });
    }

    @Test
    void testPurchaseItem_ItemRestricted() {
        CanteenCategory category = new CanteenCategory();
        category.setId(1L);
        category.setName("Meals");

        CanteenItem item = new CanteenItem();
        item.setId(5L);
        item.setItemName("French Fries");
        item.setPrice(new BigDecimal("5.00"));
        item.setCategory(category);
        item.setIsAvailable(1);

        CanteenWallet wallet = new CanteenWallet();
        wallet.setStudentId(10L);
        wallet.setIsActive(1);

        CanteenRestriction restriction = new CanteenRestriction();
        restriction.setStudentId(10L);
        restriction.setRestrictionType(CanteenRestriction.RestrictionType.item_block);
        restriction.setItemId(5L);
        restriction.setIsActive(1);

        when(itemRepository.findById(5L)).thenReturn(Optional.of(item));
        when(walletRepository.findByStudentId(10L)).thenReturn(Optional.of(wallet));
        when(restrictionRepository.findByStudentIdAndIsActive(10L, 1)).thenReturn(List.of(restriction));

        assertThrows(IllegalArgumentException.class, () -> {
            canteenService.purchaseItem(10L, 5L, 1, "wallet", "Should fail due to restriction");
        });
    }
}
