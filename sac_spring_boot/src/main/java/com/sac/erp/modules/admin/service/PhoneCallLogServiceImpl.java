package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.PhoneCallLog;
import com.sac.erp.modules.admin.repository.PhoneCallLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhoneCallLogServiceImpl implements PhoneCallLogService {

    private final PhoneCallLogRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<PhoneCallLog> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public PhoneCallLog getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PhoneCallLog not found with id: " + id));
    }

    @Override
    @Transactional
    public PhoneCallLog create(PhoneCallLog entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public PhoneCallLog update(Long id, PhoneCallLog entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        PhoneCallLog existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
