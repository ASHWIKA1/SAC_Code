package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.NewsPage;
import java.util.List;

public interface NewsPageService {
    List<NewsPage> getAll();
    NewsPage getById(Long id);
    NewsPage create(NewsPage entity);
    NewsPage update(Long id, NewsPage entity);
    void delete(Long id);
}
