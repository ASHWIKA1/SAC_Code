package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.schoolId = :schoolId AND po.isDeleted = 0 AND " +
           "(:search IS NULL OR LOWER(po.poNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(po.vendor.vendorName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<PurchaseOrder> searchPurchaseOrders(@Param("schoolId") String schoolId, @Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.schoolId = :schoolId AND po.isDeleted = 0 AND po.poStatus = :status")
    long countByStatus(@Param("schoolId") String schoolId, @Param("status") String status);
}
