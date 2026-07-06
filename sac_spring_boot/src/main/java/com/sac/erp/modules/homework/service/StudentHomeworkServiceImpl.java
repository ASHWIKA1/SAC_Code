package com.sac.erp.modules.homework.service;

import com.sac.erp.modules.homework.entity.StudentHomework;
import com.sac.erp.modules.homework.repository.StudentHomeworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentHomeworkServiceImpl implements StudentHomeworkService {

    private final StudentHomeworkRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentHomework> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentHomework getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentHomework not found with id: " + id));
    }

    @Override
    @Transactional
    public StudentHomework create(StudentHomework entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public StudentHomework update(Long id, StudentHomework entity) {
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
