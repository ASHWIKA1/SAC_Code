package com.sac.erp.modules.lesson.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_lesson_topic_details")
public class SmLessonTopicDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id")
    private Long lessonId;

    @Column(name = "topic_title", nullable = false)
    private String topicTitle;

    @Column(name = "completed_status")
    private String completedStatus;

    @Column(name = "competed_date")
    private LocalDate completedDate;

    @Column(name = "active_status")
    private Integer activeStatus = 1;

    @Column(name = "topic_id")
    private Long topicId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
