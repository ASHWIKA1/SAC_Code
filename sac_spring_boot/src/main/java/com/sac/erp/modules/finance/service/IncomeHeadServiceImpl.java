package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.IncomeHead;
import com.sac.erp.modules.finance.repository.IncomeHeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeHeadServiceImpl implements IncomeHeadService {

    private final IncomeHeadRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<IncomeHead> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public IncomeHead getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("IncomeHead not found with id: " + id));
    }

    @Override
    @Transactional
    public IncomeHead create(IncomeHead entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public IncomeHead update(Long id, IncomeHead entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        IncomeHead existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
