package com.sac.erp.modules.homework.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_student_homeworks")
public class StudentHomework extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "homework_date")
    private LocalDate homeworkDate;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "description")
    private String description;

    @Column(name = "percentage")
    private String percentage;

    @Column(name = "status")
    private String status;

    @Column(name = "evaluated_by")
    private Integer evaluatedBy;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
