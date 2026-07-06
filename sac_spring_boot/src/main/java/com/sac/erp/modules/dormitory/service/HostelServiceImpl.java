package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.Hostel;
import com.sac.erp.modules.dormitory.repository.HostelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HostelServiceImpl implements HostelService {

    private final HostelRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<Hostel> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Hostel getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found with id: " + id));
    }

    @Override
    @Transactional
    public Hostel create(Hostel entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Hostel update(Long id, Hostel entity) {
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
