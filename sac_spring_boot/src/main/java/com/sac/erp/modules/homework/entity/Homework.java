package com.sac.erp.modules.homework.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_homeworks")
public class Homework extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "homework_date")
    private LocalDate homeworkDate;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "subject_id")
    private Long subjectId;

    private String description;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
