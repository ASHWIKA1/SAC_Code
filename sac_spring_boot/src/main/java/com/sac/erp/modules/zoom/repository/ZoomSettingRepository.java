package com.sac.erp.modules.zoom.repository;

import com.sac.erp.modules.zoom.entity.ZoomSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZoomSettingRepository extends JpaRepository<ZoomSetting, Long> {
    Optional<ZoomSetting> findFirstBy();
}
