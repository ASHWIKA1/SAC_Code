package com.sac.erp.modules.lesson.repository;

import com.sac.erp.modules.lesson.entity.LessonPlanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonPlannerRepository extends JpaRepository<LessonPlanner, Long> {
    List<LessonPlanner> findByTeacherIdAndClassIdAndSectionIdAndSubjectIdAndAcademicId(
            Long teacherId, Long classId, Long sectionId, Long subjectId, Long academicId);
    List<LessonPlanner> findByClassIdAndSectionId(Long classId, Long sectionId);
}
