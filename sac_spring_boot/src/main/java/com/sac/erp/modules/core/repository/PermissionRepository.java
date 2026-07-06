package com.sac.erp.modules.core.repository;

import com.sac.erp.modules.core.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByStatus(Integer status);
    Optional<Permission> findByRoute(String route);
}
