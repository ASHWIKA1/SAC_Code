package com.sac.erp.modules.lesson.repository;

import com.sac.erp.modules.lesson.entity.SmLessonTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SmLessonTopicRepository extends JpaRepository<SmLessonTopic, Long> {
    List<SmLessonTopic> findByLessonId(Long lessonId);
}
