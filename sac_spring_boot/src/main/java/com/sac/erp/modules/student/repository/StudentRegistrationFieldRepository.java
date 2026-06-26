package com.sac.erp.modules.student.repository;

import com.sac.erp.modules.student.entity.StudentRegistrationField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentRegistrationFieldRepository extends JpaRepository<StudentRegistrationField, Long> {
    List<StudentRegistrationField> findByActiveStatus(Integer activeStatus);
}
