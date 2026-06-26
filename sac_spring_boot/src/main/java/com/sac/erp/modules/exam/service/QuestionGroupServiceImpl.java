package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.QuestionGroup;
import com.sac.erp.modules.exam.repository.QuestionGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionGroupServiceImpl implements QuestionGroupService {

    private final QuestionGroupRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionGroup> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionGroup getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionGroup not found with id: " + id));
    }

    @Override
    @Transactional
    public QuestionGroup create(QuestionGroup entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public QuestionGroup update(Long id, QuestionGroup entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        QuestionGroup existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
