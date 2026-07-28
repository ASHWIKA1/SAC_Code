package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.AssignmentEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AssignmentEvaluationRepository extends JpaRepository<AssignmentEvaluation, Long> {
    Optional<AssignmentEvaluation> findByStudentAssignmentId(Long studentAssignmentId);
}
