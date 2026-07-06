package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.GeneralBookIssue;
import com.sac.erp.modules.library.repository.GeneralBookIssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GeneralBookIssueServiceImpl implements GeneralBookIssueService {

    private final GeneralBookIssueRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<GeneralBookIssue> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public GeneralBookIssue getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("GeneralBookIssue not found with id: " + id));
    }

    @Override
    @Transactional
    public GeneralBookIssue create(GeneralBookIssue entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public GeneralBookIssue update(Long id, GeneralBookIssue entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        GeneralBookIssue existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
