package com.sac.erp.modules.lesson.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_lessons")
public class SmLesson extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_title")
    private String lessonTitle;

    @Column(name = "active_status")
    private Integer activeStatus = 1;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "user_id")
    private Long userId;
    @Column(name = "school_id")
    private String schoolId;
}
