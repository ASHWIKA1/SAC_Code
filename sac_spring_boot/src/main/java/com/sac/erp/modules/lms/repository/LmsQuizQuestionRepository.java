package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.LmsQuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LmsQuizQuestionRepository extends JpaRepository<LmsQuizQuestion, Long> {
    List<LmsQuizQuestion> findByQuizId(Long quizId);
}
