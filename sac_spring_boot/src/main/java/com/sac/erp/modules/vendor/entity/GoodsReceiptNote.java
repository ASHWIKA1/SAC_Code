package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_grns")
public class GoodsReceiptNote extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grn_number", nullable = false, unique = true)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "received_quantity")
    private Integer receivedQuantity = 0;

    @Column(name = "accepted_quantity")
    private Integer acceptedQuantity = 0;

    @Column(name = "rejected_quantity")
    private Integer rejectedQuantity = 0;

    @Column(name = "inspection_remarks", columnDefinition = "TEXT")
    private String inspectionRemarks;

    @Column(name = "store_location_id")
    private Long storeLocationId; // Links to sm_item_stores

    @Column(name = "file_url")
    private String fileUrl; // Attachments

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
