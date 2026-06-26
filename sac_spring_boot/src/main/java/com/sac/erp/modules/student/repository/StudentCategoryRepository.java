package com.sac.erp.modules.student.repository;

import com.sac.erp.modules.student.entity.StudentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentCategoryRepository extends JpaRepository<StudentCategory, Long> {
}
