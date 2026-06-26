package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.entity.StudentPlacementProfile;
import com.sac.erp.modules.student.repository.StudentPlacementProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentPlacementProfileServiceImpl implements StudentPlacementProfileService {

    private final StudentPlacementProfileRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentPlacementProfile> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPlacementProfile getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentPlacementProfile not found with id: " + id));
    }

    @Override
    @Transactional
    public StudentPlacementProfile create(StudentPlacementProfile entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public StudentPlacementProfile update(Long id, StudentPlacementProfile entity) {
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
