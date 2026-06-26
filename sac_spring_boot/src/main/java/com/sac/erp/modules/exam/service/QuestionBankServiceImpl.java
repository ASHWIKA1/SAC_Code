package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.QuestionBank;
import com.sac.erp.modules.exam.repository.QuestionBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionBankServiceImpl implements QuestionBankService {

    private final QuestionBankRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionBank> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionBank getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionBank not found with id: " + id));
    }

    @Override
    @Transactional
    public QuestionBank create(QuestionBank entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public QuestionBank update(Long id, QuestionBank entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        QuestionBank existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
