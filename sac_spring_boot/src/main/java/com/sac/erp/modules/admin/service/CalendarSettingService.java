package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.CalendarSetting;
import java.util.List;

public interface CalendarSettingService {
    List<CalendarSetting> getAll();
    CalendarSetting getById(Long id);
    CalendarSetting create(CalendarSetting entity);
    CalendarSetting update(Long id, CalendarSetting entity);
    void delete(Long id);
}
