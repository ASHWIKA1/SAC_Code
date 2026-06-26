package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.AmountTransfer;
import com.sac.erp.modules.finance.repository.AmountTransferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmountTransferServiceImpl implements AmountTransferService {

    private final AmountTransferRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<AmountTransfer> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public AmountTransfer getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("AmountTransfer not found with id: " + id));
    }

    @Override
    @Transactional
    public AmountTransfer create(AmountTransfer entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public AmountTransfer update(Long id, AmountTransfer entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        AmountTransfer existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
