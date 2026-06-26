package com.sac.erp.modules.exam.controller;

import com.sac.erp.modules.exam.dto.BulkMarksEntryDto;
import com.sac.erp.modules.exam.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamManagementController {

    private final ExamService examService;

    @PostMapping("/marks")
    public ResponseEntity<Void> saveStudentMarks(@Valid @RequestBody BulkMarksEntryDto dto) {
        log.info("REST request to save student marks registry");
        examService.saveStudentMarks(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students/{studentId}/gpa")
    public ResponseEntity<Double> getStudentGpa(
            @PathVariable Long studentId,
            @RequestParam("classId") Long classId,
            @RequestParam("sectionId") Long sectionId) {
        log.info("REST request to calculate GPA for Student : {}", studentId);
        Double gpa = examService.calculateStudentGpa(studentId, classId, sectionId);
        return ResponseEntity.ok(gpa);
    }
}
