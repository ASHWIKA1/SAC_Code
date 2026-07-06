package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.HostelVisitor;
import com.sac.erp.modules.dormitory.repository.HostelVisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HostelVisitorServiceImpl implements HostelVisitorService {

    private final HostelVisitorRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<HostelVisitor> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public HostelVisitor getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("HostelVisitor not found with id: " + id));
    }

    @Override
    @Transactional
    public HostelVisitor create(HostelVisitor entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public HostelVisitor update(Long id, HostelVisitor entity) {
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
