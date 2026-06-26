package com.sac.erp.modules.ai.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "ai_generated_contents")
public class AiGeneratedContent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "template_id")
    private Long templateId;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "model")
    private String model;

    @Column(name = "language")
    private String language;

    @Column(name = "tone")
    private String tone;

    @Column(name = "creativity")
    private String creativity;

    @Column(name = "word_count")
    private Integer wordCount;
    @Column(name = "school_id")
    private String schoolId;
}
