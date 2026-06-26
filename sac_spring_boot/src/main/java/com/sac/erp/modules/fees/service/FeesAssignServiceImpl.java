package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.FeesAssign;
import com.sac.erp.modules.fees.repository.FeesAssignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeesAssignServiceImpl implements FeesAssignService {

    private final FeesAssignRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<FeesAssign> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public FeesAssign getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FeesAssign not found with id: " + id));
    }

    @Override
    @Transactional
    public FeesAssign create(FeesAssign entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public FeesAssign update(Long id, FeesAssign entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        FeesAssign existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
