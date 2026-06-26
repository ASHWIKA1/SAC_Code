package com.sac.erp.modules.academic.controller;

import com.sac.erp.modules.academic.entity.AssignClassTeacher;
import com.sac.erp.modules.academic.service.AssignClassTeacherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/academic/assignclassteacher")
@RequiredArgsConstructor
public class AssignClassTeacherController {

    private final AssignClassTeacherService service;

    @GetMapping
    public ResponseEntity<List<AssignClassTeacher>> getAll() {
        log.info("REST request to get all AssignClassTeachers");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignClassTeacher> getById(@PathVariable Long id) {
        log.info("REST request to get AssignClassTeacher : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<AssignClassTeacher> create(@RequestBody AssignClassTeacher entity) {
        log.info("REST request to create AssignClassTeacher");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignClassTeacher> update(@PathVariable Long id, @RequestBody AssignClassTeacher entity) {
        log.info("REST request to update AssignClassTeacher : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete AssignClassTeacher : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
