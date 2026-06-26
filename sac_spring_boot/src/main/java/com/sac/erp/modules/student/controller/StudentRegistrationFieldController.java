package com.sac.erp.modules.student.controller;

import com.sac.erp.modules.student.entity.StudentRegistrationField;
import com.sac.erp.modules.student.service.StudentRegistrationFieldService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/student/studentregistrationfield")
@RequiredArgsConstructor
public class StudentRegistrationFieldController {

    private final StudentRegistrationFieldService service;

    @GetMapping
    public ResponseEntity<List<StudentRegistrationField>> getAll() {
        log.info("REST request to get all StudentRegistrationFields");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentRegistrationField> getById(@PathVariable Long id) {
        log.info("REST request to get StudentRegistrationField : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<StudentRegistrationField> create(@RequestBody StudentRegistrationField entity) {
        log.info("REST request to create StudentRegistrationField");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentRegistrationField> update(@PathVariable Long id, @RequestBody StudentRegistrationField entity) {
        log.info("REST request to update StudentRegistrationField : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete StudentRegistrationField : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
