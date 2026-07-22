package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_documents")
public class VendorDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "document_type", nullable = false)
    private String documentType; // GST Certificate, PAN Card, NDA, MOU, etc.

    @Column(name = "document_number")
    private String documentNumber;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "reminder_before_expiry_days")
    private Integer reminderBeforeExpiryDays = 30;

    private String status = "Pending"; // Pending, Verified, Rejected, Expired

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verified_date")
    private LocalDate verifiedDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
