package com.sac.erp.modules.jitsi.repository;

import com.sac.erp.modules.jitsi.entity.JitsiSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JitsiSettingRepository extends JpaRepository<JitsiSetting, Long> {
}
