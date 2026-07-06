package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.AboutPage;
import java.util.List;

public interface AboutPageService {
    List<AboutPage> getAll();
    AboutPage getById(Long id);
    AboutPage create(AboutPage entity);
    AboutPage update(Long id, AboutPage entity);
    void delete(Long id);
}
