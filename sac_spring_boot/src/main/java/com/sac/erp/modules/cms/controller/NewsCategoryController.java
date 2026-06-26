package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.NewsCategory;
import com.sac.erp.modules.cms.service.NewsCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/newscategory")
@RequiredArgsConstructor
public class NewsCategoryController {

    private final NewsCategoryService service;

    @GetMapping
    public ResponseEntity<List<NewsCategory>> getAll() {
        log.info("REST request to get all NewsCategorys");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsCategory> getById(@PathVariable Long id) {
        log.info("REST request to get NewsCategory : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsCategory> create(@RequestBody NewsCategory entity) {
        log.info("REST request to create NewsCategory");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsCategory> update(@PathVariable Long id, @RequestBody NewsCategory entity) {
        log.info("REST request to update NewsCategory : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete NewsCategory : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
