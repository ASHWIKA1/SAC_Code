package com.sac.erp.repository;

import com.sac.erp.entity.AssignPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignPermissionRepository extends JpaRepository<AssignPermission, Long> {
    List<AssignPermission> findByRoleIdAndStatus(Long roleId, Integer status);
}
