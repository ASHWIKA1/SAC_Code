package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.NewsCategory;
import java.util.List;

public interface NewsCategoryService {
    List<NewsCategory> getAll();
    NewsCategory getById(Long id);
    NewsCategory create(NewsCategory entity);
    NewsCategory update(Long id, NewsCategory entity);
    void delete(Long id);
}
