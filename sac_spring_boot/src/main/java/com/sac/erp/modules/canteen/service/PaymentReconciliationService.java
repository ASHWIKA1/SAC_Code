package com.sac.erp.modules.canteen.service;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.repository.*;
import com.sac.erp.modules.canteen.controller.KdsWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentReconciliationService {

    private final CanteenWalletRepository walletRepository;
    private final CanteenOrderRepository orderRepository;
    private final CanteenItemRepository itemRepository;
    private final KdsWebSocketHandler webSocketHandler;

    @Transactional
    public CanteenOrder processPrepaidPayment(CanteenOrder order, List<CanteenOrderItem> items) {
        String cardUid = order.getCardUid();
        CanteenWallet wallet = walletRepository.findByRfidCardUid(cardUid)
                .orElseThrow(() -> new IllegalArgumentException("No canteen wallet linked to RFID card: " + cardUid));

        if (wallet.getIsLocked() || wallet.getIsActive() != 1) {
            throw new IllegalStateException("Canteen wallet is locked or suspended.");
        }

        BigDecimal total = order.getTotalAmount();

        // Enforce daily spend limit
        BigDecimal spentToday = wallet.getTodaysSpentAmount();
        if (spentToday.add(total).compareTo(wallet.getDailyLimit()) > 0) {
            throw new IllegalArgumentException("Daily spending limit exceeded.");
        }

        // Enforce blocked categories
        String blocked = wallet.getBlockedCategories();
        if (blocked != null && !blocked.trim().isEmpty()) {
            for (CanteenOrderItem orderItem : items) {
                CanteenItem menuItem = itemRepository.findById(orderItem.getMenuItemId())
                        .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
                String catName = menuItem.getCategory().getName().toLowerCase();
                if (blocked.toLowerCase().contains(catName)) {
                    throw new IllegalArgumentException("Item '" + menuItem.getItemName() + "' belongs to a blocked category for this wallet.");
                }
            }
        }

        // Deduct balance
        if (wallet.getBalance().compareTo(total) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance.");
        }
        wallet.setBalance(wallet.getBalance().subtract(total));
        wallet.setTodaysSpentAmount(wallet.getTodaysSpentAmount().add(total));
        walletRepository.save(wallet);

        // Update order status
        order.setPaymentStatus(CanteenOrder.PaymentStatus.PAID);
        order.setOrderStatus(CanteenOrder.OrderStatus.PAYMENT_DONE);
        CanteenOrder savedOrder = orderRepository.save(order);

        // Broadcast to student and KDS
        webSocketHandler.sendEvent("ORDER_STATUS_CHANGED", savedOrder);
        webSocketHandler.sendEvent("WALLET_BALANCE_UPDATED", wallet);

        return savedOrder;
    }

    @Transactional
    public CanteenOrder processCodOrder(CanteenOrder order) {
        order.setPaymentStatus(CanteenOrder.PaymentStatus.PENDING);
        order.setOrderStatus(CanteenOrder.OrderStatus.ORDER_RECEIVED);
        CanteenOrder saved = orderRepository.save(order);

        webSocketHandler.sendEvent("ORDER_STATUS_CHANGED", saved);
        return saved;
    }

    @Transactional
    public CanteenOrder clearCodPayment(Long orderId) {
        CanteenOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getPaymentMode() != CanteenOrder.PaymentMode.COD) {
            throw new IllegalArgumentException("Only COD orders can be cleared via this method.");
        }

        order.setPaymentStatus(CanteenOrder.PaymentStatus.CLEARED);
        order.setOrderStatus(CanteenOrder.OrderStatus.PAYMENT_DONE);
        CanteenOrder saved = orderRepository.save(order);

        webSocketHandler.sendEvent("ORDER_STATUS_CHANGED", saved);
        return saved;
    }

    @Transactional
    public CanteenOrder simulateUpiWebhook(Long orderId) {
        CanteenOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setPaymentStatus(CanteenOrder.PaymentStatus.PAID);
        order.setOrderStatus(CanteenOrder.OrderStatus.PAYMENT_DONE);
        CanteenOrder saved = orderRepository.save(order);

        webSocketHandler.sendEvent("ORDER_STATUS_CHANGED", saved);
        return saved;
    }
}
