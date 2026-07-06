package com.sac.erp.modules.student.repository;

import com.sac.erp.modules.student.entity.StudentIdCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentIdCardRepository extends JpaRepository<StudentIdCard, Long> {
    List<StudentIdCard> findByActiveStatus(Integer activeStatus);
}
