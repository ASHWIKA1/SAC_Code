package com.sac.erp.modules.homework.controller;

import com.sac.erp.modules.homework.entity.StudentHomework;
import com.sac.erp.modules.homework.service.StudentHomeworkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/homework/studenthomework")
@RequiredArgsConstructor
public class StudentHomeworkController {

    private final StudentHomeworkService service;

    @GetMapping
    public ResponseEntity<List<StudentHomework>> getAll() {
        log.info("REST request to get all StudentHomeworks");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentHomework> getById(@PathVariable Long id) {
        log.info("REST request to get StudentHomework : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<StudentHomework> create(@RequestBody StudentHomework entity) {
        log.info("REST request to create StudentHomework");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentHomework> update(@PathVariable Long id, @RequestBody StudentHomework entity) {
        log.info("REST request to update StudentHomework : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete StudentHomework : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
