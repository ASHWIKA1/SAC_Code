package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.AiQuestionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiQuestionHistoryRepository extends JpaRepository<AiQuestionHistory, Long> {
}
