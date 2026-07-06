package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.BankStatement;
import com.sac.erp.modules.finance.repository.BankStatementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BankStatementServiceImpl implements BankStatementService {

    private final BankStatementRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<BankStatement> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public BankStatement getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BankStatement not found with id: " + id));
    }

    @Override
    @Transactional
    public BankStatement create(BankStatement entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public BankStatement update(Long id, BankStatement entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        BankStatement existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
