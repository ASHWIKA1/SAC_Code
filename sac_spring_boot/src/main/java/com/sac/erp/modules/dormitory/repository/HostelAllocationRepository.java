package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, Long> {
    List<HostelAllocation> findByStatus(String status);
    List<HostelAllocation> findByStudentId(Long studentId);
    List<HostelAllocation> findByRoomId(Long roomId);
    Optional<HostelAllocation> findByStudentIdAndStatus(Long studentId, String status);
}
