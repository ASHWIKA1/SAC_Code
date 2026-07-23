package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.StudentAssignmentReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAssignmentReviewRepository extends JpaRepository<StudentAssignmentReview, Long> {
    List<StudentAssignmentReview> findByIsDeleted(Integer isDeleted);
}
