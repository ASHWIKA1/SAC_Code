package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Vendor> {

    List<Vendor> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);

    Optional<Vendor> findByIdAndSchoolIdAndIsDeleted(Long id, String schoolId, Integer isDeleted);

    Optional<Vendor> findByVendorCodeAndIsDeleted(String vendorCode, Integer isDeleted);

    @Query("SELECT v FROM Vendor v WHERE v.schoolId = :schoolId AND v.isDeleted = 0 AND " +
           "(:search IS NULL OR LOWER(v.vendorName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.companyName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.vendorCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Vendor> searchVendors(@Param("schoolId") String schoolId, @Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.schoolId = :schoolId AND v.isDeleted = 0")
    long countActiveVendors(@Param("schoolId") String schoolId);

    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.schoolId = :schoolId AND v.isDeleted = 0 AND v.status = :status")
    long countByStatus(@Param("schoolId") String schoolId, @Param("status") String status);
}
