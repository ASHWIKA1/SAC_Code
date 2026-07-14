package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.LmsQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LmsQuizAttemptRepository extends JpaRepository<LmsQuizAttempt, Long> {
    List<LmsQuizAttempt> findByQuizId(Long quizId);
    List<LmsQuizAttempt> findByStudentId(Long studentId);
    List<LmsQuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);
}
