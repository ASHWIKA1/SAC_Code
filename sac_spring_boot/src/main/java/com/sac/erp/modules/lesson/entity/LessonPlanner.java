package com.sac.erp.modules.lesson.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "lesson_planners")
public class LessonPlanner extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "`day`")
    private Integer day; // 1=Sat...7=Fri

    @Column(name = "active_status")
    private Integer activeStatus = 1;

    @Column(name = "lesson_id")
    private Long lessonId;

    @Column(name = "topic_id")
    private Long topicId;

    @Column(name = "lesson_detail_id")
    private Long lessonDetailId;

    @Column(name = "topic_detail_id")
    private Long topicDetailId;

    @Column(name = "sub_topic")
    private String subTopic;

    @Column(name = "lecture_youube_link", columnDefinition = "TEXT")
    private String lectureYoutubeLink;

    @Column(name = "lecture_vedio", columnDefinition = "TEXT")
    private String lectureVideo;

    @Column(name = "attachment", columnDefinition = "TEXT")
    private String attachment;

    @Column(name = "teaching_method", columnDefinition = "TEXT")
    private String teachingMethod;

    @Column(name = "general_objectives", columnDefinition = "TEXT")
    private String generalObjectives;

    @Column(name = "previous_knowlege", columnDefinition = "TEXT")
    private String previousKnowledge;

    @Column(name = "comp_question", columnDefinition = "TEXT")
    private String compQuestion;

    @Column(name = "zoom_setup", columnDefinition = "TEXT")
    private String zoomSetup;

    @Column(name = "presentation", columnDefinition = "TEXT")
    private String presentation;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "lesson_date")
    private LocalDate lessonDate;

    @Column(name = "competed_date")
    private LocalDate completedDate;

    @Column(name = "completed_status")
    private String completedStatus;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "class_period_id")
    private Long classPeriodId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "routine_id")
    private Long routineId;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
