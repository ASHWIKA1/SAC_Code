package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.entity.AssignClassTeacher;
import com.sac.erp.modules.academic.repository.AssignClassTeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignClassTeacherServiceImpl implements AssignClassTeacherService {

    private final AssignClassTeacherRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<AssignClassTeacher> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public AssignClassTeacher getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("AssignClassTeacher not found with id: " + id));
    }

    @Override
    @Transactional
    public AssignClassTeacher create(AssignClassTeacher entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public AssignClassTeacher update(Long id, AssignClassTeacher entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        AssignClassTeacher existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
