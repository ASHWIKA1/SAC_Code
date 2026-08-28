package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.VendorAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorAuditLogRepository extends JpaRepository<VendorAuditLog, Long> {

    List<VendorAuditLog> findBySchoolId(String schoolId);

    @Query("SELECT val FROM VendorAuditLog val WHERE val.schoolId = :schoolId AND " +
           "(:search IS NULL OR LOWER(val.action) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(val.performedBy) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(val.details) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VendorAuditLog> searchAuditLogs(@Param("schoolId") String schoolId, @Param("search") String search, Pageable pageable);
}
