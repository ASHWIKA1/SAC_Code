package com.sac.erp.modules.admin.controller;

import com.sac.erp.modules.admin.entity.CalendarSetting;
import com.sac.erp.modules.admin.service.CalendarSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/calendarsetting")
@RequiredArgsConstructor
public class CalendarSettingController {

    private final CalendarSettingService service;

    @GetMapping
    public ResponseEntity<List<CalendarSetting>> getAll() {
        log.info("REST request to get all CalendarSettings");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarSetting> getById(@PathVariable Long id) {
        log.info("REST request to get CalendarSetting : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CalendarSetting> create(@RequestBody CalendarSetting entity) {
        log.info("REST request to create CalendarSetting");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarSetting> update(@PathVariable Long id, @RequestBody CalendarSetting entity) {
        log.info("REST request to update CalendarSetting : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete CalendarSetting : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
