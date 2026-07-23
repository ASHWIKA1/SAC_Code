package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.StudentMediaContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentMediaContentRepository extends JpaRepository<StudentMediaContent, Long> {
    List<StudentMediaContent> findByStudentIdAndIsDeleted(Long studentId, Integer isDeleted);
}
