package com.sac.erp.modules.attendance.controller;

import com.sac.erp.modules.attendance.dto.BulkStudentAttendanceDto;
import com.sac.erp.modules.attendance.entity.StudentAttendance;
import com.sac.erp.modules.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/attendance/students")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<Void> saveStudentAttendance(@Valid @RequestBody BulkStudentAttendanceDto dto) {
        log.info("REST request to save student attendance registry");
        attendanceService.saveStudentAttendance(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<StudentAttendance>> getStudentAttendanceReport(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("classId") Long classId,
            @RequestParam("sectionId") Long sectionId) {
        log.info("REST request to get student attendance report for Date : {} Class : {} Section : {}", date, classId, sectionId);
        List<StudentAttendance> report = attendanceService.getStudentAttendanceReport(date, classId, sectionId);
        return ResponseEntity.ok(report);
    }
}
