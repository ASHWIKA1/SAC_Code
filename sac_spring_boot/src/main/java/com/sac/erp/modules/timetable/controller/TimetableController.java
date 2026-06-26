package com.sac.erp.modules.timetable.controller;

import com.sac.erp.modules.timetable.entity.*;
import com.sac.erp.modules.timetable.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    // Routines
    @GetMapping("/routines")
    public ResponseEntity<List<ClassRoutine>> getRoutines(
            @RequestParam Long classId,
            @RequestParam Long sectionId) {
        return ResponseEntity.ok(timetableService.getRoutines(classId, sectionId));
    }

    @PostMapping("/routines")
    public ResponseEntity<ClassRoutine> saveRoutine(@RequestBody ClassRoutine routine) {
        return ResponseEntity.ok(timetableService.saveRoutine(routine));
    }

    // Routine Updates
    @GetMapping("/updates")
    public ResponseEntity<List<ClassRoutineUpdate>> getUpdates(
            @RequestParam Long classId,
            @RequestParam Long sectionId) {
        return ResponseEntity.ok(timetableService.getRoutineUpdates(classId, sectionId));
    }

    @PostMapping("/updates")
    public ResponseEntity<ClassRoutineUpdate> addUpdate(@RequestBody ClassRoutineUpdate update) {
        try {
            ClassRoutineUpdate saved = timetableService.addRoutineUpdate(update);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Rules
    @GetMapping("/rules")
    public ResponseEntity<List<TimetableRule>> getRules(
            @RequestParam Long classId,
            @RequestParam Long sectionId) {
        return ResponseEntity.ok(timetableService.getRules(classId, sectionId));
    }

    @PostMapping("/rules")
    public ResponseEntity<TimetableRule> saveRule(@RequestBody TimetableRule rule) {
        return ResponseEntity.ok(timetableService.saveRule(rule));
    }

    // Teacher Constraints
    @GetMapping("/constraints/{teacherId}")
    public ResponseEntity<TimetableTeacherConstraint> getConstraint(@PathVariable Long teacherId) {
        return ResponseEntity.ok(timetableService.getTeacherConstraint(teacherId));
    }

    @PostMapping("/constraints")
    public ResponseEntity<TimetableTeacherConstraint> saveConstraint(@RequestBody TimetableTeacherConstraint constraint) {
        return ResponseEntity.ok(timetableService.saveTeacherConstraint(constraint));
    }
}
