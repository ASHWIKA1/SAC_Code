package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_ndas")
public class NdaAgreement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "nda_number", nullable = false, unique = true)
    private String ndaNumber;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "confidentiality_level")
    private String confidentialityLevel = "Medium"; // Low, Medium, High, Critical

    @Column(name = "file_url")
    private String fileUrl;

    private String status = "Active"; // Active, Expired, Terminated

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
