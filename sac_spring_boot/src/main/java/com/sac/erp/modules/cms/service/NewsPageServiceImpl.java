package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.NewsPage;
import com.sac.erp.modules.cms.repository.NewsPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsPageServiceImpl implements NewsPageService {

    private final NewsPageRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<NewsPage> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public NewsPage getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("NewsPage not found with id: " + id));
    }

    @Override
    @Transactional
    public NewsPage create(NewsPage entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public NewsPage update(Long id, NewsPage entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        NewsPage existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
