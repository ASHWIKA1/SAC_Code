package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.HostelRfidLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelRfidLogRepository extends JpaRepository<HostelRfidLog, Long> {
    List<HostelRfidLog> findByStudentId(Long studentId);
    List<HostelRfidLog> findByEntryStatus(String entryStatus);
    List<HostelRfidLog> findByFlagged(Integer flagged);
}
