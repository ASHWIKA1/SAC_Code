package com.sac.erp.modules.exam.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_exam_types")
public class ExamType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "is_average", nullable = false)
    private Integer isAverage = 0;

    @Column(name = "percentage")
    private Double percentage;

    @Column(name = "average_mark", nullable = false)
    private Double averageMark = 0.0;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
