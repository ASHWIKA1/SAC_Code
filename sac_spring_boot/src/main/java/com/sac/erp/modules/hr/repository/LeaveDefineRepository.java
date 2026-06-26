package com.sac.erp.modules.hr.repository;

import com.sac.erp.modules.hr.entity.LeaveDefine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveDefineRepository extends JpaRepository<LeaveDefine, Long> {
    List<LeaveDefine> findByRoleId(Long roleId);
    List<LeaveDefine> findByUserId(Long userId);
    List<LeaveDefine> findByRoleIdOrUserId(Long roleId, Long userId);
    Optional<LeaveDefine> findByRoleIdAndLeaveTypeId(Long roleId, Long leaveTypeId);
    Optional<LeaveDefine> findByUserIdAndLeaveTypeId(Long userId, Long leaveTypeId);
}
