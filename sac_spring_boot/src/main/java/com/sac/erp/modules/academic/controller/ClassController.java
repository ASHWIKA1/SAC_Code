package com.sac.erp.modules.academic.controller;

import com.sac.erp.modules.academic.dto.ClassRecordDto;
import com.sac.erp.modules.academic.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/academics/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping
    public ResponseEntity<List<ClassRecordDto>> getAllClasses() {
        log.info("REST request to get all Classes");
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassRecordDto> getClassById(@PathVariable Long id) {
        log.info("REST request to get Class : {}", id);
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @PostMapping
    public ResponseEntity<ClassRecordDto> createClass(@Valid @RequestBody ClassRecordDto dto) {
        log.info("REST request to create Class: {}", dto.getClassName());
        return ResponseEntity.ok(classService.createClass(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassRecordDto> updateClass(@PathVariable Long id, @Valid @RequestBody ClassRecordDto dto) {
        log.info("REST request to update Class : {}", id);
        return ResponseEntity.ok(classService.updateClass(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        log.info("REST request to delete Class : {}", id);
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
