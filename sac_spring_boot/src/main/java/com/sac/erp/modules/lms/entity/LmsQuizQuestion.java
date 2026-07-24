package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "lms_quiz_questions")
public class LmsQuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private LmsQuiz quiz;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "question_type", nullable = false)
    private String questionType;

    @Column(columnDefinition = "TEXT")
    private String options; // JSON serialized string list of choices

    @Column(columnDefinition = "TEXT")
    private String correct; // JSON serialized correct index (e.g. "0" or "[1, 2]")

    @Column(name = "image_url")
    private String imageUrl;
}
