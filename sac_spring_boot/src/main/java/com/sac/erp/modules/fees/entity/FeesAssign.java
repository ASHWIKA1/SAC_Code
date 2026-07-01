package com.sac.erp.modules.fees.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_fees_assigns")
public class FeesAssign extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "fees_amount")
    private Double feesAmount;

    @Column(name = "applied_discount")
    private Double appliedDiscount;

    @Column(name = "fees_master_id")
    private Long feesMasterId;

    @Column(name = "fees_discount_id")
    private Long feesDiscountId;

    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;
}
