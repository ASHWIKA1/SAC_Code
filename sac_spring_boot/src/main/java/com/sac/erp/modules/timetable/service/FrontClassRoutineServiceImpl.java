package com.sac.erp.modules.timetable.service;

import com.sac.erp.modules.timetable.entity.FrontClassRoutine;
import com.sac.erp.modules.timetable.repository.FrontClassRoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FrontClassRoutineServiceImpl implements FrontClassRoutineService {

    private final FrontClassRoutineRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<FrontClassRoutine> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public FrontClassRoutine getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FrontClassRoutine not found with id: " + id));
    }

    @Override
    @Transactional
    public FrontClassRoutine create(FrontClassRoutine entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public FrontClassRoutine update(Long id, FrontClassRoutine entity) {
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
