package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.BankPaymentSlip;
import com.sac.erp.modules.finance.repository.BankPaymentSlipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BankPaymentSlipServiceImpl implements BankPaymentSlipService {

    private final BankPaymentSlipRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<BankPaymentSlip> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public BankPaymentSlip getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BankPaymentSlip not found with id: " + id));
    }

    @Override
    @Transactional
    public BankPaymentSlip create(BankPaymentSlip entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public BankPaymentSlip update(Long id, BankPaymentSlip entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        BankPaymentSlip existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
