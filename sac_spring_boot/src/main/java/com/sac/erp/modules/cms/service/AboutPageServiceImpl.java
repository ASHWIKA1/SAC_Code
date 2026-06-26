package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.AboutPage;
import com.sac.erp.modules.cms.repository.AboutPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AboutPageServiceImpl implements AboutPageService {

    private final AboutPageRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<AboutPage> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public AboutPage getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("AboutPage not found with id: " + id));
    }

    @Override
    @Transactional
    public AboutPage create(AboutPage entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public AboutPage update(Long id, AboutPage entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        AboutPage existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
