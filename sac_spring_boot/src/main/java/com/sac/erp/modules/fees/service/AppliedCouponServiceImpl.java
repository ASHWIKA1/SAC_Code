package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.AppliedCoupon;
import com.sac.erp.modules.fees.repository.AppliedCouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppliedCouponServiceImpl implements AppliedCouponService {

    private final AppliedCouponRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<AppliedCoupon> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public AppliedCoupon getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("AppliedCoupon not found with id: " + id));
    }

    @Override
    @Transactional
    public AppliedCoupon create(AppliedCoupon entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public AppliedCoupon update(Long id, AppliedCoupon entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
