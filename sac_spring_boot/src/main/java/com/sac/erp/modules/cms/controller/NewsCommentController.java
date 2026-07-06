package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.NewsComment;
import com.sac.erp.modules.cms.service.NewsCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/newscomment")
@RequiredArgsConstructor
public class NewsCommentController {

    private final NewsCommentService service;

    @GetMapping
    public ResponseEntity<List<NewsComment>> getAll() {
        log.info("REST request to get all NewsComments");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsComment> getById(@PathVariable Long id) {
        log.info("REST request to get NewsComment : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsComment> create(@RequestBody NewsComment entity) {
        log.info("REST request to create NewsComment");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsComment> update(@PathVariable Long id, @RequestBody NewsComment entity) {
        log.info("REST request to update NewsComment : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete NewsComment : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
