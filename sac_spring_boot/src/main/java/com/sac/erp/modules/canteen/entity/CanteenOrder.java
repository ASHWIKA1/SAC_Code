package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_orders")
public class CanteenOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_token_id")
    private String orderTokenId; // daily sequential e.g. TKN-088

    @Column(name = "card_uid")
    private String cardUid; // CARD-9021

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode")
    private PaymentMode paymentMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    @Column(name = "time_ordered")
    private LocalDateTime timeOrdered = LocalDateTime.now();

    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Column(name = "pickup_counter_id")
    private String pickupCounterId;

    @Column(name = "school_id")
    private String schoolId;

    public enum PaymentMode {
        PREPAID, UPI, COD
    }

    public enum PaymentStatus {
        PENDING, PAID, CLEARED
    }

    public enum OrderStatus {
        PAYMENT_DONE, ORDER_RECEIVED, CURRENTLY_PREPARING, READY_FOR_COLLECTION, FULFILLED, CANCELLED
    }
}
