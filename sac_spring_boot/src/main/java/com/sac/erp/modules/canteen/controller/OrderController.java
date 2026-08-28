package com.sac.erp.modules.canteen.controller;

import com.sac.erp.modules.canteen.entity.*;
import com.sac.erp.modules.canteen.repository.*;
import com.sac.erp.modules.canteen.service.CanteenService;
import com.sac.erp.modules.canteen.service.PaymentReconciliationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@RestController
@RequestMapping("/api/v1/canteen/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CanteenOrderRepository orderRepository;
    private final CanteenOrderItemRepository orderItemRepository;
    private final PaymentReconciliationService reconciliationService;
    private final CanteenService canteenService;
    private final KdsWebSocketHandler webSocketHandler;

    private static final AtomicInteger tokenCounter = new AtomicInteger(100);

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> payload) {
        try {
            String cardUid = (String) payload.get("cardUid");
            BigDecimal totalAmount = new BigDecimal(payload.get("totalAmount").toString());
            String modeStr = (String) payload.get("paymentMode");
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) payload.get("items");

            CanteenOrder.PaymentMode paymentMode = CanteenOrder.PaymentMode.valueOf(modeStr);

            CanteenOrder order = new CanteenOrder();
            order.setCardUid(cardUid);
            order.setTotalAmount(totalAmount);
            order.setPaymentMode(paymentMode);
            order.setPaymentStatus(CanteenOrder.PaymentStatus.PENDING);
            order.setOrderStatus(CanteenOrder.OrderStatus.ORDER_RECEIVED);
            order.setTimeOrdered(LocalDateTime.now());
            order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(15));
            order.setOrderTokenId("TKN-" + tokenCounter.incrementAndGet());
            order.setPickupCounterId("Counter " + ((tokenCounter.get() % 3) + 1));

            if (payload.containsKey("scheduledTime") && payload.get("scheduledTime") != null) {
                order.setScheduledTime(LocalDateTime.parse(payload.get("scheduledTime").toString(), DateTimeFormatter.ISO_DATE_TIME));
            }

            CanteenOrder savedOrder = orderRepository.save(order);

            List<CanteenOrderItem> orderItems = new ArrayList<>();
            for (Map<String, Object> itemMap : cartItems) {
                CanteenOrderItem item = new CanteenOrderItem();
                item.setOrderId(savedOrder.getId());
                item.setMenuItemId(Long.valueOf(itemMap.get("id").toString()));
                item.setQuantity(Integer.parseInt(itemMap.get("quantity").toString()));
                item.setUnitPrice(new BigDecimal(itemMap.get("price").toString()));
                if (itemMap.containsKey("notes")) {
                    item.setKitchenNotes((String) itemMap.get("notes"));
                }
                orderItemRepository.save(item);
                orderItems.add(item);
            }

            // Route through payment gateway simulation
            if (paymentMode == CanteenOrder.PaymentMode.PREPAID) {
                savedOrder = reconciliationService.processPrepaidPayment(savedOrder, orderItems);
            } else if (paymentMode == CanteenOrder.PaymentMode.COD) {
                savedOrder = reconciliationService.processCodOrder(savedOrder);
            } else if (paymentMode == CanteenOrder.PaymentMode.UPI) {
                savedOrder = reconciliationService.processCodOrder(savedOrder); // starts pending payment
            }

            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            log.error("Order checkout failed: ", e);
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, 
                                          @RequestParam(value = "status", required = false) String statusParam,
                                          @RequestBody(required = false) Map<String, String> body) {
        try {
            String status = statusParam;
            if (status == null || status.trim().isEmpty()) {
                if (body != null && body.containsKey("status")) {
                    status = body.get("status");
                }
            }
            if (status == null || status.trim().isEmpty()) {
                throw new IllegalArgumentException("Required parameter 'status' is missing.");
            }

            CanteenOrder order = orderRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

            CanteenOrder.OrderStatus newStatus = CanteenOrder.OrderStatus.valueOf(status.trim());
            order.setOrderStatus(newStatus);

            if (newStatus == CanteenOrder.OrderStatus.FULFILLED) {
                canteenService.depleteRecipeIngredients(id);
            }

            CanteenOrder saved = orderRepository.save(order);
            webSocketHandler.sendEvent("ORDER_STATUS_CHANGED", saved);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Failed to update status for order {}: ", id, e);
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<CanteenOrder>> getActiveOrders() {
        List<CanteenOrder> all = orderRepository.findAll();
        List<CanteenOrder> active = all.stream()
                .filter(o -> o.getOrderStatus() != CanteenOrder.OrderStatus.FULFILLED 
                        && o.getOrderStatus() != CanteenOrder.OrderStatus.CANCELLED)
                .toList();
        return ResponseEntity.ok(active);
    }

    @GetMapping("/track/{cardUid}")
    public ResponseEntity<List<CanteenOrder>> trackOrdersByCard(@PathVariable String cardUid) {
        List<CanteenOrder> orders = orderRepository.findByCardUid(cardUid);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<CanteenOrderItem>> getOrderItems(@PathVariable Long id) {
        return ResponseEntity.ok(orderItemRepository.findByOrderId(id));
    }

    // UPI gateway webhook simulation
    @PostMapping("/{id}/upi-webhook")
    public ResponseEntity<?> triggerUpiWebhook(@PathVariable Long id) {
        try {
            CanteenOrder order = reconciliationService.simulateUpiWebhook(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // COD cash payment clearance by cashier
    @PostMapping("/{id}/clear-cod")
    public ResponseEntity<?> clearCodPayment(@PathVariable Long id) {
        try {
            CanteenOrder order = reconciliationService.clearCodPayment(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
