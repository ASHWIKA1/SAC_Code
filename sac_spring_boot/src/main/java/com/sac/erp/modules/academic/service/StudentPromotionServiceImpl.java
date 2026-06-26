package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.entity.StudentPromotion;
import com.sac.erp.modules.academic.repository.StudentPromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentPromotionServiceImpl implements StudentPromotionService {

    private final StudentPromotionRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentPromotion> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPromotion getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentPromotion not found with id: " + id));
    }

    @Override
    @Transactional
    public StudentPromotion create(StudentPromotion entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public StudentPromotion update(Long id, StudentPromotion entity) {
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
