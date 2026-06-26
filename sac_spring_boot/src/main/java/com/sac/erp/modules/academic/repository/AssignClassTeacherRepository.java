package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.AssignClassTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignClassTeacherRepository extends JpaRepository<AssignClassTeacher, Long> {
    List<AssignClassTeacher> findByActiveStatus(Integer activeStatus);
}
