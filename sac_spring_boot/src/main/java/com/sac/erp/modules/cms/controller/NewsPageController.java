package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.NewsPage;
import com.sac.erp.modules.cms.service.NewsPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/newspage")
@RequiredArgsConstructor
public class NewsPageController {

    private final NewsPageService service;

    @GetMapping
    public ResponseEntity<List<NewsPage>> getAll() {
        log.info("REST request to get all NewsPages");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsPage> getById(@PathVariable Long id) {
        log.info("REST request to get NewsPage : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsPage> create(@RequestBody NewsPage entity) {
        log.info("REST request to create NewsPage");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsPage> update(@PathVariable Long id, @RequestBody NewsPage entity) {
        log.info("REST request to update NewsPage : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete NewsPage : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
