package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.AboutPage;
import com.sac.erp.modules.cms.service.AboutPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/aboutpage")
@RequiredArgsConstructor
public class AboutPageController {

    private final AboutPageService service;

    @GetMapping
    public ResponseEntity<List<AboutPage>> getAll() {
        log.info("REST request to get all AboutPages");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AboutPage> getById(@PathVariable Long id) {
        log.info("REST request to get AboutPage : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<AboutPage> create(@RequestBody AboutPage entity) {
        log.info("REST request to create AboutPage");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AboutPage> update(@PathVariable Long id, @RequestBody AboutPage entity) {
        log.info("REST request to update AboutPage : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete AboutPage : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
