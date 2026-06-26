package com.sac.erp.modules.exam.controller;

import com.sac.erp.modules.exam.entity.FrontExamRoutine;
import com.sac.erp.modules.exam.service.FrontExamRoutineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/exam/frontexamroutine")
@RequiredArgsConstructor
public class FrontExamRoutineController {

    private final FrontExamRoutineService service;

    @GetMapping
    public ResponseEntity<List<FrontExamRoutine>> getAll() {
        log.info("REST request to get all FrontExamRoutines");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FrontExamRoutine> getById(@PathVariable Long id) {
        log.info("REST request to get FrontExamRoutine : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FrontExamRoutine> create(@RequestBody FrontExamRoutine entity) {
        log.info("REST request to create FrontExamRoutine");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FrontExamRoutine> update(@PathVariable Long id, @RequestBody FrontExamRoutine entity) {
        log.info("REST request to update FrontExamRoutine : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete FrontExamRoutine : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
