package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.ExpenseHead;
import com.sac.erp.modules.finance.repository.ExpenseHeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseHeadServiceImpl implements ExpenseHeadService {

    private final ExpenseHeadRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseHead> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseHead getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExpenseHead not found with id: " + id));
    }

    @Override
    @Transactional
    public ExpenseHead create(ExpenseHead entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public ExpenseHead update(Long id, ExpenseHead entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ExpenseHead existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
