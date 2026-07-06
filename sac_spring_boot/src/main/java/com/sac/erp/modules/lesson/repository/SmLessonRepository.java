package com.sac.erp.modules.lesson.repository;

import com.sac.erp.modules.lesson.entity.SmLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SmLessonRepository extends JpaRepository<SmLesson, Long> {
    List<SmLesson> findByClassIdAndSectionIdAndSubjectIdAndAcademicId(Long classId, Long sectionId, Long subjectId, Long academicId);
    List<SmLesson> findByActiveStatus(Integer activeStatus);
}
