package com.sac.erp.modules.lesson.repository;

import com.sac.erp.modules.lesson.entity.SmLessonDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SmLessonDetailRepository extends JpaRepository<SmLessonDetail, Long> {
    List<SmLessonDetail> findByLessonId(Long lessonId);
}
