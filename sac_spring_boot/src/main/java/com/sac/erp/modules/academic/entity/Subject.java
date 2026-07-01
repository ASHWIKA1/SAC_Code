package com.sac.erp.modules.academic.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_subjects")
public class Subject extends BaseEntity {

    public enum SubjectType {
        T, P // Theory, Practical
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "subject_code")
    private String subjectCode;

    @Column(name = "pass_mark")
    private Double passMark;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false)
    private SubjectType subjectType;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
