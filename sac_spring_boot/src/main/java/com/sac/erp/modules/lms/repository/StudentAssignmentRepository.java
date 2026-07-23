package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.StudentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAssignmentRepository extends JpaRepository<StudentAssignment, Long> {
    List<StudentAssignment> findByStudentIdAndIsDeleted(Long studentId, Integer isDeleted);
    List<StudentAssignment> findByAssignmentIdAndIsDeleted(Long assignmentId, Integer isDeleted);
    Optional<StudentAssignment> findByAssignmentIdAndStudentIdAndIsDeleted(Long assignmentId, Long studentId, Integer isDeleted);
}
