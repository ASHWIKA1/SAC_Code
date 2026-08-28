package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {
    List<DeliveryTracking> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
    List<DeliveryTracking> findByPurchaseOrderIdAndIsDeleted(Long poId, Integer isDeleted);
}
