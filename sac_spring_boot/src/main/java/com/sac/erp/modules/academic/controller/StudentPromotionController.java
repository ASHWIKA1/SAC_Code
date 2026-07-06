package com.sac.erp.modules.academic.controller;

import com.sac.erp.modules.academic.entity.StudentPromotion;
import com.sac.erp.modules.academic.service.StudentPromotionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/academic/studentpromotion")
@RequiredArgsConstructor
public class StudentPromotionController {

    private final StudentPromotionService service;

    @GetMapping
    public ResponseEntity<List<StudentPromotion>> getAll() {
        log.info("REST request to get all StudentPromotions");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentPromotion> getById(@PathVariable Long id) {
        log.info("REST request to get StudentPromotion : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<StudentPromotion> create(@RequestBody StudentPromotion entity) {
        log.info("REST request to create StudentPromotion");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentPromotion> update(@PathVariable Long id, @RequestBody StudentPromotion entity) {
        log.info("REST request to update StudentPromotion : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete StudentPromotion : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
