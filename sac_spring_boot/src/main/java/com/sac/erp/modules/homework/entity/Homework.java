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

    private String title;

    private String instructions;

    @Column(name = "start_date")
    private java.time.LocalDateTime startDate;

    @Column(name = "end_date")
    private java.time.LocalDateTime endDate;

    @Column(name = "max_marks")
    private Integer maxMarks = 100;

    @Column(name = "passing_marks")
    private Integer passingMarks = 40;

    @Column(name = "assignment_type")
    private String assignmentType = "Written Essay";

    @Column(name = "allowed_file_types")
    private String allowedFileTypes = "pdf, zip, docx";

    @Column(name = "max_file_size")
    private Integer maxFileSize = 10;

    @Column(name = "allow_late_submission")
    private Boolean allowLateSubmission = true;

    @Column(name = "portal_mode")
    private String portalMode = "College";

    @Column(name = "school_class")
    private String schoolClass;

    @Column(name = "school_section")
    private String schoolSection;

    @Column(name = "school_term")
    private String schoolTerm;

    @Column(name = "school_grading_scale")
    private String schoolGradingScale;

    @Column(name = "parent_signature_required")
    private Boolean parentSignatureRequired = false;

    @Column(name = "status_id")
    private Integer statusId = 1;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
