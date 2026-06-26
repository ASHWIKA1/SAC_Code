package com.sac.erp.modules.student.controller;

import com.sac.erp.modules.student.entity.StudentIdCard;
import com.sac.erp.modules.student.service.StudentIdCardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/student/studentidcard")
@RequiredArgsConstructor
public class StudentIdCardController {

    private final StudentIdCardService service;

    @GetMapping
    public ResponseEntity<List<StudentIdCard>> getAll() {
        log.info("REST request to get all StudentIdCards");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentIdCard> getById(@PathVariable Long id) {
        log.info("REST request to get StudentIdCard : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<StudentIdCard> create(@RequestBody StudentIdCard entity) {
        log.info("REST request to create StudentIdCard");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentIdCard> update(@PathVariable Long id, @RequestBody StudentIdCard entity) {
        log.info("REST request to update StudentIdCard : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete StudentIdCard : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
