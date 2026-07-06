package com.sac.erp.modules.lesson.repository;

import com.sac.erp.modules.lesson.entity.SmLessonTopicDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SmLessonTopicDetailRepository extends JpaRepository<SmLessonTopicDetail, Long> {
    List<SmLessonTopicDetail> findByTopicId(Long topicId);
}
