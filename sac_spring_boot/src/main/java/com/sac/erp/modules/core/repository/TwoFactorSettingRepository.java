package com.sac.erp.modules.core.repository;

import com.sac.erp.modules.core.entity.TwoFactorSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TwoFactorSettingRepository extends JpaRepository<TwoFactorSetting, Long> {
}
