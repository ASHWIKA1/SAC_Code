package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssignmentStatusRepository extends JpaRepository<AssignmentStatus, Long> {
    Optional<AssignmentStatus> findByStatusNameIgnoreCase(String statusName);
}
