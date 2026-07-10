package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.GeneratedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GeneratedQuestionRepository extends JpaRepository<GeneratedQuestion, Long> {
    List<GeneratedQuestion> findByHistoryId(Long historyId);
}
