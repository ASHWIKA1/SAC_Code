package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.AssignmentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentDetailsRepository extends JpaRepository<AssignmentDetails, Long> {
    List<AssignmentDetails> findByIsDeleted(Integer isDeleted);
    List<AssignmentDetails> findByCourseIdAndIsDeleted(Long courseId, Integer isDeleted);
}
