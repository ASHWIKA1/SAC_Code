package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.NewsCategory;
import com.sac.erp.modules.cms.repository.NewsCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsCategoryServiceImpl implements NewsCategoryService {

    private final NewsCategoryRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<NewsCategory> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public NewsCategory getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("NewsCategory not found with id: " + id));
    }

    @Override
    @Transactional
    public NewsCategory create(NewsCategory entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public NewsCategory update(Long id, NewsCategory entity) {
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
