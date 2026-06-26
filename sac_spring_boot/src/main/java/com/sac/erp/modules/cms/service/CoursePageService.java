package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.CoursePage;
import java.util.List;

public interface CoursePageService {
    List<CoursePage> getAll();
    CoursePage getById(Long id);
    CoursePage create(CoursePage entity);
    CoursePage update(Long id, CoursePage entity);
    void delete(Long id);
}
