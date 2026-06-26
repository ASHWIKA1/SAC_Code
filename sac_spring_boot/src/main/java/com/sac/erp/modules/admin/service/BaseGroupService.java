package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.BaseGroup;
import java.util.List;

public interface BaseGroupService {
    List<BaseGroup> getAll();
    BaseGroup getById(Long id);
    BaseGroup create(BaseGroup entity);
    BaseGroup update(Long id, BaseGroup entity);
    void delete(Long id);
}
