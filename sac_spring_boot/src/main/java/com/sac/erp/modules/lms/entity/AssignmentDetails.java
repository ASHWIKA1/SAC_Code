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

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "subject_id", nullable = false)
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
}
