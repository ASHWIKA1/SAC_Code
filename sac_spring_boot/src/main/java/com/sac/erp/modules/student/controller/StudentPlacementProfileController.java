package com.sac.erp.modules.student.controller;

import com.sac.erp.modules.student.entity.StudentPlacementProfile;
import com.sac.erp.modules.student.service.StudentPlacementProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/student/studentplacementprofile")
@RequiredArgsConstructor
public class StudentPlacementProfileController {

    private final StudentPlacementProfileService service;

    @GetMapping
    public ResponseEntity<List<StudentPlacementProfile>> getAll() {
        log.info("REST request to get all StudentPlacementProfiles");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentPlacementProfile> getById(@PathVariable Long id) {
        log.info("REST request to get StudentPlacementProfile : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<StudentPlacementProfile> create(@RequestBody StudentPlacementProfile entity) {
        log.info("REST request to create StudentPlacementProfile");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentPlacementProfile> update(@PathVariable Long id, @RequestBody StudentPlacementProfile entity) {
        log.info("REST request to update StudentPlacementProfile : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete StudentPlacementProfile : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
