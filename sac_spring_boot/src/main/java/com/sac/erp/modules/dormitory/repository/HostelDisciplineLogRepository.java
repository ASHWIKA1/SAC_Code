package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.HostelDisciplineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelDisciplineLogRepository extends JpaRepository<HostelDisciplineLog, Long> {
    List<HostelDisciplineLog> findByStudentId(Long studentId);
    List<HostelDisciplineLog> findBySeverity(String severity);
    List<HostelDisciplineLog> findByStatus(String status);
}
