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
@Table(name = "sm_vendor_mous")
public class MouAgreement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "mou_number", nullable = false, unique = true)
    private String mouNumber;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String purpose;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "contract_value")
    private BigDecimal contractValue = BigDecimal.ZERO;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "approval_status")
    private String approvalStatus = "Pending"; // Pending, Approved, Rejected

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
