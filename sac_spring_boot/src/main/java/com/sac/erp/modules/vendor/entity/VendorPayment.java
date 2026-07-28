package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_payments")
public class VendorPayment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @Column(name = "file_url")
    private String fileUrl; // Invoice upload

    @Column(name = "tax_amount")
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "tds_amount")
    private BigDecimal tdsAmount = BigDecimal.ZERO;

    @Column(name = "gst_amount")
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(name = "invoice_amount")
    private BigDecimal invoiceAmount = BigDecimal.ZERO;

    @Column(name = "payment_request_status")
    private String paymentRequestStatus = "Pending Approval"; // Pending Approval, Approved, Rejected

    @Column(name = "payment_status")
    private String paymentStatus = "Unpaid"; // Unpaid, Partially Paid, Paid

    @Column(name = "bank_transfer_details")
    private String bankTransferDetails;

    @Column(name = "outstanding_balance")
    private BigDecimal outstandingBalance = BigDecimal.ZERO;

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
