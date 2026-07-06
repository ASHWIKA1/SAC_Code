package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.BaseGroup;
import com.sac.erp.modules.admin.repository.BaseGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaseGroupServiceImpl implements BaseGroupService {

    private final BaseGroupRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<BaseGroup> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public BaseGroup getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BaseGroup not found with id: " + id));
    }

    @Override
    @Transactional
    public BaseGroup create(BaseGroup entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public BaseGroup update(Long id, BaseGroup entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        BaseGroup existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
