package com.sac.erp.modules.homework.controller;

import com.sac.erp.modules.homework.entity.*;
import com.sac.erp.modules.homework.service.HomeworkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/homework")
@RequiredArgsConstructor
public class HomeworkController {

    private final HomeworkService homeworkService;

    @GetMapping
    public ResponseEntity<List<Homework>> getHomeworks() {
        log.info("REST request to get all active homework tasks");
        return ResponseEntity.ok(homeworkService.getAllHomeworks());
    }

    @GetMapping("/class/{classId}/section/{sectionId}")
    public ResponseEntity<List<Homework>> getHomeworksByClassSection(
            @PathVariable Long classId,
            @PathVariable Long sectionId) {
        log.info("REST request to get homework tasks for class/section: {}/{}", classId, sectionId);
        return ResponseEntity.ok(homeworkService.getHomeworksByClassSection(classId, sectionId));
    }

    @PostMapping
    public ResponseEntity<Homework> createHomework(@RequestBody Homework homework) {
        log.info("REST request to create homework task for class: {}", homework.getClassId());
        return ResponseEntity.ok(homeworkService.createHomework(homework));
    }

    @PostMapping("/submit")
    public ResponseEntity<HomeworkStudent> submitHomework(
            @RequestParam Long homeworkId,
            @RequestParam Long studentId,
            @RequestParam String file) {
        log.info("REST request student: {} submits homework task: {}", studentId, homeworkId);
        return ResponseEntity.ok(homeworkService.submitHomework(homeworkId, studentId, file));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<HomeworkStudent> evaluateHomework(
            @RequestParam Long homeworkId,
            @RequestParam Long studentId,
            @RequestParam String marks,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String feedbackFile) {
        log.info("REST request teacher evaluates student: {} for task: {}", studentId, homeworkId);
        return ResponseEntity.ok(homeworkService.evaluateHomework(homeworkId, studentId, marks, status, feedbackFile));
    }

    @GetMapping("/submissions/{homeworkId}")
    public ResponseEntity<List<HomeworkStudent>> getSubmissions(@PathVariable Long homeworkId) {
        log.info("REST request to get submissions list for task: {}", homeworkId);
        return ResponseEntity.ok(homeworkService.getSubmissionsByHomework(homeworkId));
    }
}
