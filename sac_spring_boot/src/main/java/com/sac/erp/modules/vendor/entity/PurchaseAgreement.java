package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_agreements")
public class PurchaseAgreement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "agreement_number", nullable = false, unique = true)
    private String agreementNumber;

    @Column(name = "agreement_type", nullable = false)
    private String agreementType; // Purchase Agreement, Service Agreement, AMC Agreement, etc.

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "contract_value")
    private BigDecimal contractValue = BigDecimal.ZERO;

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    @Column(name = "penalty_clause", columnDefinition = "TEXT")
    private String penaltyClause;

    @Column(name = "terms_conditions", columnDefinition = "TEXT")
    private String termsConditions;

    @Column(name = "approval_status")
    private String approvalStatus = "Pending"; // Pending, Approved, Rejected

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
