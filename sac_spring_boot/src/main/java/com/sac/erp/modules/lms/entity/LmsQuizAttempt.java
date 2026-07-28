package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "lms_quiz_attempts")
public class LmsQuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id", nullable = false)
    private LmsQuiz quiz;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    private Integer score;

    private Integer evaluated = 0;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(columnDefinition = "TEXT")
    private String answers; // JSON serialized map of student answers

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "allowed_reattempt")
    private Integer allowedReattempt = 0;
}
