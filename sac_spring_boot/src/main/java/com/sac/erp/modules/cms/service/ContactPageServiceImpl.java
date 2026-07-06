package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.ContactPage;
import com.sac.erp.modules.cms.repository.ContactPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactPageServiceImpl implements ContactPageService {

    private final ContactPageRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ContactPage> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactPage getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ContactPage not found with id: " + id));
    }

    @Override
    @Transactional
    public ContactPage create(ContactPage entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public ContactPage update(Long id, ContactPage entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ContactPage existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
