package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.CoursePage;
import com.sac.erp.modules.cms.repository.CoursePageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoursePageServiceImpl implements CoursePageService {

    private final CoursePageRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<CoursePage> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public CoursePage getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CoursePage not found with id: " + id));
    }

    @Override
    @Transactional
    public CoursePage create(CoursePage entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public CoursePage update(Long id, CoursePage entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        CoursePage existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
