package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.FeesCarryForward;
import java.util.List;

public interface FeesCarryForwardService {
    List<FeesCarryForward> getAll();
    FeesCarryForward getById(Long id);
    FeesCarryForward create(FeesCarryForward entity);
    FeesCarryForward update(Long id, FeesCarryForward entity);
    void delete(Long id);
}
