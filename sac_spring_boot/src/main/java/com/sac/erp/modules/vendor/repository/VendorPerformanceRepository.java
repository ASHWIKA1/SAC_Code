package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.VendorPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorPerformanceRepository extends JpaRepository<VendorPerformance, Long> {
    List<VendorPerformance> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
    Optional<VendorPerformance> findByVendorIdAndIsDeleted(Long vendorId, Integer isDeleted);
}
