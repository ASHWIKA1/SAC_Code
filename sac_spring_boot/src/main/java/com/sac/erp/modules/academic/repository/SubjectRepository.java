package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByActiveStatus(Integer activeStatus);
}
