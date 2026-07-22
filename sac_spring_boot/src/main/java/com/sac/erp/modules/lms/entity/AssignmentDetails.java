package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "assignments_details")
public class AssignmentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = true)
    private Long courseId;

    @Column(name = "subject_id", nullable = true)
    private Long subjectId;

    @Column(nullable = false)
    private String title;

    private String instructions;

    @Column(name = "submit_date", nullable = false)
    private LocalDateTime submitDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private AssignmentStatus status;

    @Column(name = "created_date", insertable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", insertable = false, updatable = false)
    private LocalDateTime updatedDate;

    @Column(name = "updated_by_user")
    private Long updatedByUser;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

    private String batch;

    private String semester;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "passing_marks")
    private Integer passingMarks;

    @Column(name = "assignment_type")
    private String assignmentType;

    @Column(name = "allowed_file_types")
    private String allowedFileTypes;

    @Column(name = "max_file_size")
    private Integer maxFileSize;

    @Column(name = "allow_late_submission")
    private Integer allowLateSubmission = 1;
}
