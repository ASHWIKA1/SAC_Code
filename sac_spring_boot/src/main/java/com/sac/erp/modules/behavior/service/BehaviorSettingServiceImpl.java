package com.sac.erp.modules.behavior.service;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import com.sac.erp.modules.behavior.repository.BehaviorSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BehaviorSettingServiceImpl implements BehaviorSettingService {

    private final BehaviorSettingRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<BehaviorSetting> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public BehaviorSetting getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BehaviorSetting not found with id: " + id));
    }

    @Override
    @Transactional
    public BehaviorSetting create(BehaviorSetting entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public BehaviorSetting update(Long id, BehaviorSetting entity) {
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
