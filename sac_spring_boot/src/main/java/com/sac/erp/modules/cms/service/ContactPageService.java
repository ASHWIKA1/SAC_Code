package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.ContactPage;
import java.util.List;

public interface ContactPageService {
    List<ContactPage> getAll();
    ContactPage getById(Long id);
    ContactPage create(ContactPage entity);
    ContactPage update(Long id, ContactPage entity);
    void delete(Long id);
}
