package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_mess_billings")
public class HostelMessBilling extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "hostel_id", nullable = false)
    private Long hostelId;

    @Column(name = "billing_month", nullable = false)
    private String billingMonth;

    @Column(name = "mess_plan", nullable = false)
    private String messPlan = "Standard";

    @Column(name = "base_amount", nullable = false)
    private BigDecimal baseAmount = BigDecimal.ZERO;

    @Column(name = "additional_charges", nullable = false)
    private BigDecimal additionalCharges = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "status", nullable = false)
    private String status = "Pending";

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "school_id")
    private String schoolId;
}
