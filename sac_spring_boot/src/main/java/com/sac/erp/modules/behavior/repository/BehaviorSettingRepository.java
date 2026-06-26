package com.sac.erp.modules.behavior.repository;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BehaviorSettingRepository extends JpaRepository<BehaviorSetting, Long> {
}
