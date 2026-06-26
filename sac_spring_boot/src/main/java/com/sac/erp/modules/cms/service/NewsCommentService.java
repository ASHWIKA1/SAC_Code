package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.NewsComment;
import java.util.List;

public interface NewsCommentService {
    List<NewsComment> getAll();
    NewsComment getById(Long id);
    NewsComment create(NewsComment entity);
    NewsComment update(Long id, NewsComment entity);
    void delete(Long id);
}
