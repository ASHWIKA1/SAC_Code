package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "student_assignment")
public class StudentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private AssignmentDetails assignment;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private AssignmentStatus status;

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "created_date", insertable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", insertable = false, updatable = false)
    private LocalDateTime updatedDate;

    @Column(name = "updated_by_user")
    private Long updatedByUser;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
