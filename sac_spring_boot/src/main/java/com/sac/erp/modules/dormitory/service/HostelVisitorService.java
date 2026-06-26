package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.HostelVisitor;
import java.util.List;

public interface HostelVisitorService {
    List<HostelVisitor> getAll();
    HostelVisitor getById(Long id);
    HostelVisitor create(HostelVisitor entity);
    HostelVisitor update(Long id, HostelVisitor entity);
    void delete(Long id);
}
