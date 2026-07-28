package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "ai_question_history")
public class AiQuestionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "bloom_level", nullable = false)
    private String bloomLevel;

    @Column(name = "question_type", nullable = false)
    private String questionType;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
