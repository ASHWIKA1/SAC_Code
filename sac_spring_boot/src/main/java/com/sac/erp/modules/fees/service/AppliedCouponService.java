package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.AppliedCoupon;
import java.util.List;

public interface AppliedCouponService {
    List<AppliedCoupon> getAll();
    AppliedCoupon getById(Long id);
    AppliedCoupon create(AppliedCoupon entity);
    AppliedCoupon update(Long id, AppliedCoupon entity);
    void delete(Long id);
}
