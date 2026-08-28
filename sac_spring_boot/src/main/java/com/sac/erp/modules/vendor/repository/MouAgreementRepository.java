package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.MouAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MouAgreementRepository extends JpaRepository<MouAgreement, Long> {
    List<MouAgreement> findByVendorIdAndIsDeleted(Long vendorId, Integer isDeleted);
    List<MouAgreement> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
}
