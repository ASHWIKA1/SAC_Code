package com.sac.erp.modules.hr.repository;

import com.sac.erp.modules.hr.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStaffId(Long staffId);
    List<LeaveRequest> findByApproveStatus(String approveStatus);
    List<LeaveRequest> findByRoleId(Long roleId);
}
