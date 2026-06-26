package com.sac.erp.modules.lesson.service;

import com.sac.erp.modules.lesson.entity.*;
import java.util.List;

public interface LessonService {
    // Lessons
    List<SmLesson> getLessons(Long classId, Long sectionId, Long subjectId, Long academicId);
    SmLesson createLesson(SmLesson lesson);
    SmLesson updateLesson(Long id, SmLesson lesson);
    void deleteLesson(Long id);

    // Lesson Details
    List<SmLessonDetail> getLessonDetails(Long lessonId);
    SmLessonDetail createLessonDetail(SmLessonDetail detail);

    // Topics
    List<SmLessonTopic> getTopicsByLesson(Long lessonId);
    SmLessonTopic createTopic(SmLessonTopic topic);

    // Topic Details
    List<SmLessonTopicDetail> getTopicDetails(Long topicId);
    SmLessonTopicDetail createTopicDetail(SmLessonTopicDetail detail);

    // Lesson Planner
    List<LessonPlanner> getLessonPlanners(Long teacherId, Long classId, Long sectionId, Long subjectId, Long academicId);
    LessonPlanner createLessonPlanner(LessonPlanner planner);
    LessonPlanner updateLessonPlanner(Long id, LessonPlanner planner);
    void deleteLessonPlanner(Long id);
}
