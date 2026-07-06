package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.FrontExamRoutine;
import com.sac.erp.modules.exam.repository.FrontExamRoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FrontExamRoutineServiceImpl implements FrontExamRoutineService {

    private final FrontExamRoutineRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<FrontExamRoutine> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public FrontExamRoutine getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FrontExamRoutine not found with id: " + id));
    }

    @Override
    @Transactional
    public FrontExamRoutine create(FrontExamRoutine entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public FrontExamRoutine update(Long id, FrontExamRoutine entity) {
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
