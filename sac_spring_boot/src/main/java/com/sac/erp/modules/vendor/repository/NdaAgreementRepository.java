package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.NdaAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NdaAgreementRepository extends JpaRepository<NdaAgreement, Long> {
    List<NdaAgreement> findByVendorIdAndIsDeleted(Long vendorId, Integer isDeleted);
    List<NdaAgreement> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
}
