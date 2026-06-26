package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.SetupAdmin;
import com.sac.erp.modules.admin.repository.SetupAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SetupAdminServiceImpl implements SetupAdminService {

    private final SetupAdminRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<SetupAdmin> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public SetupAdmin getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("SetupAdmin not found with id: " + id));
    }

    @Override
    @Transactional
    public SetupAdmin create(SetupAdmin entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public SetupAdmin update(Long id, SetupAdmin entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        SetupAdmin existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
