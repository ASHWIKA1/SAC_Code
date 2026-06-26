package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.entity.StudentIdCard;
import com.sac.erp.modules.student.repository.StudentIdCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentIdCardServiceImpl implements StudentIdCardService {

    private final StudentIdCardRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentIdCard> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentIdCard getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentIdCard not found with id: " + id));
    }

    @Override
    @Transactional
    public StudentIdCard create(StudentIdCard entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public StudentIdCard update(Long id, StudentIdCard entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        StudentIdCard existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
