package com.sac.erp.modules.behavior.service;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import java.util.List;

public interface BehaviorSettingService {
    List<BehaviorSetting> getAll();
    BehaviorSetting getById(Long id);
    BehaviorSetting create(BehaviorSetting entity);
    BehaviorSetting update(Long id, BehaviorSetting entity);
    void delete(Long id);
}
