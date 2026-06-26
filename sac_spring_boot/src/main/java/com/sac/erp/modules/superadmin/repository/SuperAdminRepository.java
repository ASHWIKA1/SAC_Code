package com.sac.erp.modules.superadmin.repository;

import com.sac.erp.modules.superadmin.entity.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {
    Optional<SuperAdmin> findByUsername(String username);
    Optional<SuperAdmin> findByEmail(String email);
}
