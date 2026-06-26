package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.FeesAssign;
import java.util.List;

public interface FeesAssignService {
    List<FeesAssign> getAll();
    FeesAssign getById(Long id);
    FeesAssign create(FeesAssign entity);
    FeesAssign update(Long id, FeesAssign entity);
    void delete(Long id);
}
