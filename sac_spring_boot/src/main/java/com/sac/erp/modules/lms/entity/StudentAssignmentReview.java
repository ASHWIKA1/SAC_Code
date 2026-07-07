package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "student_assignment_review")
public class StudentAssignmentReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_assignment_id", nullable = false)
    private StudentAssignment studentAssignment;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "review_date", insertable = false, updatable = false)
    private LocalDateTime reviewDate;

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
