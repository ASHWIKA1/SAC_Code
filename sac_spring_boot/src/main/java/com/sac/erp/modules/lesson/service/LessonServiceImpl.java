package com.sac.erp.modules.lesson.service;

import com.sac.erp.modules.lesson.entity.*;
import com.sac.erp.modules.lesson.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final SmLessonRepository lessonRepository;
    private final SmLessonDetailRepository lessonDetailRepository;
    private final SmLessonTopicRepository topicRepository;
    private final SmLessonTopicDetailRepository topicDetailRepository;
    private final LessonPlannerRepository plannerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SmLesson> getLessons(Long classId, Long sectionId, Long subjectId, Long academicId) {
        return lessonRepository.findByClassIdAndSectionIdAndSubjectIdAndAcademicId(classId, sectionId, subjectId, academicId);
    }

    @Override
    @Transactional
    public SmLesson createLesson(SmLesson lesson) {
        lesson.setActiveStatus(1);
        return lessonRepository.save(lesson);
    }

    @Override
    @Transactional
    public SmLesson updateLesson(Long id, SmLesson updated) {
        SmLesson existing = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found: " + id));
        existing.setLessonTitle(updated.getLessonTitle());
        existing.setActiveStatus(updated.getActiveStatus());
        return lessonRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmLessonDetail> getLessonDetails(Long lessonId) {
        return lessonDetailRepository.findByLessonId(lessonId);
    }

    @Override
    @Transactional
    public SmLessonDetail createLessonDetail(SmLessonDetail detail) {
        detail.setActiveStatus(1);
        return lessonDetailRepository.save(detail);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmLessonTopic> getTopicsByLesson(Long lessonId) {
        return topicRepository.findByLessonId(lessonId);
    }

    @Override
    @Transactional
    public SmLessonTopic createTopic(SmLessonTopic topic) {
        topic.setActiveStatus(1);
        return topicRepository.save(topic);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmLessonTopicDetail> getTopicDetails(Long topicId) {
        return topicDetailRepository.findByTopicId(topicId);
    }

    @Override
    @Transactional
    public SmLessonTopicDetail createTopicDetail(SmLessonTopicDetail detail) {
        detail.setActiveStatus(1);
        return topicDetailRepository.save(detail);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonPlanner> getLessonPlanners(Long teacherId, Long classId, Long sectionId, Long subjectId, Long academicId) {
        return plannerRepository.findByTeacherIdAndClassIdAndSectionIdAndSubjectIdAndAcademicId(
                teacherId, classId, sectionId, subjectId, academicId);
    }

    @Override
    @Transactional
    public LessonPlanner createLessonPlanner(LessonPlanner planner) {
        planner.setActiveStatus(1);
        return plannerRepository.save(planner);
    }

    @Override
    @Transactional
    public LessonPlanner updateLessonPlanner(Long id, LessonPlanner updated) {
        LessonPlanner existing = plannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson planner not found: " + id));
        existing.setLessonDate(updated.getLessonDate());
        existing.setSubTopic(updated.getSubTopic());
        existing.setTeachingMethod(updated.getTeachingMethod());
        existing.setNote(updated.getNote());
        existing.setCompletedStatus(updated.getCompletedStatus());
        existing.setCompletedDate(updated.getCompletedDate());
        return plannerRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteLessonPlanner(Long id) {
        plannerRepository.deleteById(id);
    }
}
