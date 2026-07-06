package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.NewsComment;
import com.sac.erp.modules.cms.repository.NewsCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsCommentServiceImpl implements NewsCommentService {

    private final NewsCommentRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<NewsComment> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public NewsComment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("NewsComment not found with id: " + id));
    }

    @Override
    @Transactional
    public NewsComment create(NewsComment entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public NewsComment update(Long id, NewsComment entity) {
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
