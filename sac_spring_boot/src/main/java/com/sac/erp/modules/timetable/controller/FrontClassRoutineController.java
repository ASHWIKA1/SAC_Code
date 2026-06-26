package com.sac.erp.modules.timetable.controller;

import com.sac.erp.modules.timetable.entity.FrontClassRoutine;
import com.sac.erp.modules.timetable.service.FrontClassRoutineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/timetable/frontclassroutine")
@RequiredArgsConstructor
public class FrontClassRoutineController {

    private final FrontClassRoutineService service;

    @GetMapping
    public ResponseEntity<List<FrontClassRoutine>> getAll() {
        log.info("REST request to get all FrontClassRoutines");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FrontClassRoutine> getById(@PathVariable Long id) {
        log.info("REST request to get FrontClassRoutine : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<FrontClassRoutine> create(@RequestBody FrontClassRoutine entity) {
        log.info("REST request to create FrontClassRoutine");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FrontClassRoutine> update(@PathVariable Long id, @RequestBody FrontClassRoutine entity) {
        log.info("REST request to update FrontClassRoutine : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete FrontClassRoutine : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
