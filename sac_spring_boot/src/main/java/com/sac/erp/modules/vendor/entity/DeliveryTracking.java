package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_deliveries")
public class DeliveryTracking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "expected_date")
    private LocalDate expectedDate;

    @Column(name = "dispatch_date")
    private LocalDate dispatchDate;

    @Column(name = "courier_details")
    private String courierDetails;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "pending_quantity")
    private Integer pendingQuantity = 0;

    @Column(name = "delivery_status")
    private String deliveryStatus = "Pending"; // Expected, Shipped, Delivered, Delayed, Pending

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
