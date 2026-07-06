package com.sac.erp.modules.student.repository;

import com.sac.erp.modules.student.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByFathersMobile(String fathersMobile);
}
