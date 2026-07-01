package com.sac.erp.modules.fees.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "sm_fees_carry_forwards")
public class FeesCarryForward extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "balance")
    private Double balance;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "notes")
    private String notes;

    @Column(name = "balance_type")
    private String balanceType;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
