package com.sac.erp.modules.behavior.repository;

import com.sac.erp.modules.behavior.entity.StudentBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentBehaviorRepository extends JpaRepository<StudentBehavior, Long> {
    List<StudentBehavior> findByStudentId(Long studentId);
}
