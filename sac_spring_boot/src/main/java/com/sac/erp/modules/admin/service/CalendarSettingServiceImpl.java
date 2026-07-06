package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.CalendarSetting;
import com.sac.erp.modules.admin.repository.CalendarSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarSettingServiceImpl implements CalendarSettingService {

    private final CalendarSettingRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<CalendarSetting> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CalendarSetting getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CalendarSetting not found with id: " + id));
    }

    @Override
    @Transactional
    public CalendarSetting create(CalendarSetting entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public CalendarSetting update(Long id, CalendarSetting entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
