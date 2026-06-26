package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.entity.StudentRegistrationField;
import com.sac.erp.modules.student.repository.StudentRegistrationFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentRegistrationFieldServiceImpl implements StudentRegistrationFieldService {

    private final StudentRegistrationFieldRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentRegistrationField> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentRegistrationField getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentRegistrationField not found with id: " + id));
    }

    @Override
    @Transactional
    public StudentRegistrationField create(StudentRegistrationField entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public StudentRegistrationField update(Long id, StudentRegistrationField entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        StudentRegistrationField existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
