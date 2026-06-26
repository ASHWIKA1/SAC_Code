package com.sac.erp.modules.hr.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_hr_payroll_generates")
public class PayrollGenerate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "basic_salary")
    private Double basicSalary;

    @Column(name = "total_earning")
    private Double totalEarning;

    @Column(name = "total_deduction")
    private Double totalDeduction;

    @Column(name = "gross_salary")
    private Double grossSalary;

    private Double tax;

    @Column(name = "net_salary")
    private Double netSalary;

    @Column(name = "payroll_month")
    private String payrollMonth;

    @Column(name = "payroll_year")
    private String payrollYear;

    @Column(name = "payroll_status")
    private String payrollStatus; // NG for not generated, G for generated, P for paid

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "bank_id")
    private Integer bankId;

    private String note;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "paid_amount")
    private Integer paidAmount;

    @Column(name = "is_partial")
    private Integer isPartial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
