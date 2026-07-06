package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.QuestionBankMuOption;
import com.sac.erp.modules.exam.repository.QuestionBankMuOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionBankMuOptionServiceImpl implements QuestionBankMuOptionService {

    private final QuestionBankMuOptionRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionBankMuOption> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionBankMuOption getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionBankMuOption not found with id: " + id));
    }

    @Override
    @Transactional
    public QuestionBankMuOption create(QuestionBankMuOption entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public QuestionBankMuOption update(Long id, QuestionBankMuOption entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        QuestionBankMuOption existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
