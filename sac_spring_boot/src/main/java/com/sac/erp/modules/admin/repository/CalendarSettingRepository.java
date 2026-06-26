package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.CalendarSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarSettingRepository extends JpaRepository<CalendarSetting, Long> {
}
