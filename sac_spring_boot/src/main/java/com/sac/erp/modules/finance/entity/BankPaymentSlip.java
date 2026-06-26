package com.sac.erp.modules.finance.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_bank_payment_slips")
public class BankPaymentSlip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "slip")
    private String slip;

    @Column(name = "note")
    private String note;

    @Column(name = "bank_id")
    private Long bankId;

    @Column(name = "approve_status")
    private Integer approveStatus;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "reason")
    private String reason;

    @Column(name = "fees_discount_id")
    private Long feesDiscountId;

    @Column(name = "fees_type_id")
    private Long feesTypeId;

    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "assign_id")
    private Long assignId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "child_payment_id")
    private Long childPaymentId;

    @Column(name = "installment_id")
    private Long installmentId;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "shift_id")
    private Long shiftId;
}
