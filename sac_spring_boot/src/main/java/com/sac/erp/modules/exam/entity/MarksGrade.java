package com.sac.erp.modules.exam.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_marks_grades")
public class MarksGrade extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grade_name")
    private String gradeName;

    @Column(name = "gpa")
    private Double gpa;

    @Column(name = "`from`") // Note backticks because from is a SQL reserved keyword
    private Double markFrom;

    @Column(name = "`up`") // Note backticks because up is a SQL keyword
    private Double markUp;

    @Column(name = "percent_from")
    private Double percentFrom;

    @Column(name = "percent_upto")
    private Double percentUpto;

    @Column(name = "description")
    private String description;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
