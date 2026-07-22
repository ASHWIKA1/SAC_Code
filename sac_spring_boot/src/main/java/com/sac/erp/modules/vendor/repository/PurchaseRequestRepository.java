package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.PurchaseRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);

    @Query("SELECT pr FROM PurchaseRequest pr WHERE pr.schoolId = :schoolId AND pr.isDeleted = 0 AND " +
           "(:search IS NULL OR LOWER(pr.requestNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(pr.justification) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<PurchaseRequest> searchRequests(@Param("schoolId") String schoolId, @Param("search") String search, Pageable pageable);
}
