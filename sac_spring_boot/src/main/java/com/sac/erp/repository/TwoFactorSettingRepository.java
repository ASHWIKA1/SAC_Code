package com.sac.erp.repository;

import com.sac.erp.entity.TwoFactorSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TwoFactorSettingRepository extends JpaRepository<TwoFactorSetting, Long> {
}
