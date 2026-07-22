package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.VendorPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorPaymentRepository extends JpaRepository<VendorPayment, Long> {
    List<VendorPayment> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);

    @Query("SELECT vp FROM VendorPayment vp WHERE vp.schoolId = :schoolId AND vp.isDeleted = 0 AND " +
           "(:search IS NULL OR LOWER(vp.invoiceNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(vp.vendor.vendorName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VendorPayment> searchPayments(@Param("schoolId") String schoolId, @Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(vp) FROM VendorPayment vp WHERE vp.schoolId = :schoolId AND vp.isDeleted = 0 AND vp.paymentStatus != 'Paid'")
    long countPendingPayments(@Param("schoolId") String schoolId);
}
