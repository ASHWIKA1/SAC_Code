package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.FeesCarryForward;
import com.sac.erp.modules.fees.repository.FeesCarryForwardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeesCarryForwardServiceImpl implements FeesCarryForwardService {

    private final FeesCarryForwardRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<FeesCarryForward> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public FeesCarryForward getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FeesCarryForward not found with id: " + id));
    }

    @Override
    @Transactional
    public FeesCarryForward create(FeesCarryForward entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public FeesCarryForward update(Long id, FeesCarryForward entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        FeesCarryForward existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
