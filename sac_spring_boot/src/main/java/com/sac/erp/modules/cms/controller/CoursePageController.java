package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.CoursePage;
import com.sac.erp.modules.cms.service.CoursePageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/coursepage")
@RequiredArgsConstructor
public class CoursePageController {

    private final CoursePageService service;

    @GetMapping
    public ResponseEntity<List<CoursePage>> getAll() {
        log.info("REST request to get all CoursePages");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoursePage> getById(@PathVariable Long id) {
        log.info("REST request to get CoursePage : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CoursePage> create(@RequestBody CoursePage entity) {
        log.info("REST request to create CoursePage");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoursePage> update(@PathVariable Long id, @RequestBody CoursePage entity) {
        log.info("REST request to update CoursePage : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete CoursePage : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
