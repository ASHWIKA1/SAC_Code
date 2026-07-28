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
@Table(name = "sm_vendor_consultants")
public class Consultant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "consultant_id_str", nullable = false, unique = true)
    private String consultantIdStr; // Auto generated

    @Column(nullable = false)
    private String name;

    private String specialization;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate = BigDecimal.ZERO;

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(name = "reporting_manager_id")
    private Long reportingManagerId; // Links to sm_staffs

    @Column(name = "agreement_id")
    private Long agreementId;

    @Column(name = "nda_id")
    private Long ndaId;

    @Column(name = "performance_rating")
    private BigDecimal performanceRating = BigDecimal.ZERO;

    @Column(name = "invoices_submitted_count")
    private Integer invoicesSubmittedCount = 0;

    @Column(name = "total_payments")
    private BigDecimal totalPayments = BigDecimal.ZERO;

    private String status = "Active"; // Active, Inactive

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
