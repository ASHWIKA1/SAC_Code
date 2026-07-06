package com.sac.erp.modules.behavior.controller;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import com.sac.erp.modules.behavior.service.BehaviorSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/behavior/behaviorsetting")
@RequiredArgsConstructor
public class BehaviorSettingController {

    private final BehaviorSettingService service;

    @GetMapping
    public ResponseEntity<List<BehaviorSetting>> getAll() {
        log.info("REST request to get all BehaviorSettings");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BehaviorSetting> getById(@PathVariable Long id) {
        log.info("REST request to get BehaviorSetting : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BehaviorSetting> create(@RequestBody BehaviorSetting entity) {
        log.info("REST request to create BehaviorSetting");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BehaviorSetting> update(@PathVariable Long id, @RequestBody BehaviorSetting entity) {
        log.info("REST request to update BehaviorSetting : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete BehaviorSetting : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
