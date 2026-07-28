package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.LmsQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LmsQuizRepository extends JpaRepository<LmsQuiz, Long> {
    List<LmsQuiz> findByIsDeleted(Integer isDeleted);
}
