package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.AppliedCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppliedCouponRepository extends JpaRepository<AppliedCoupon, Long> {
}
