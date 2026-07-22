package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.VendorDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorDocumentRepository extends JpaRepository<VendorDocument, Long> {
    List<VendorDocument> findByVendorIdAndIsDeleted(Long vendorId, Integer isDeleted);
    List<VendorDocument> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
}
