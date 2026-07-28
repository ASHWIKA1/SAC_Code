package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.PurchaseAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseAgreementRepository extends JpaRepository<PurchaseAgreement, Long> {
    List<PurchaseAgreement> findByVendorIdAndIsDeleted(Long vendorId, Integer isDeleted);
    List<PurchaseAgreement> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
}
