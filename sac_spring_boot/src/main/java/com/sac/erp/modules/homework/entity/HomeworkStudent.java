package com.sac.erp.modules.homework.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_homework_students")
public class HomeworkStudent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "homework_id")
    private Long homeworkId;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "complete_status")
    private String completeStatus = "NC"; // NC = Not Completed, C = Completed

    private String marks;
    private String file;

    @Column(name = "feedback_file")
    private String feedbackFile;

    @Column(name = "submission_link")
    private String submissionLink;

    @Column(name = "student_notes")
    private String studentNotes;

    private String feedback;

    @Column(name = "rubric_accuracy")
    private Integer rubricAccuracy;

    @Column(name = "rubric_completeness")
    private Integer rubricCompleteness;

    @Column(name = "rubric_presentation")
    private Integer rubricPresentation;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
