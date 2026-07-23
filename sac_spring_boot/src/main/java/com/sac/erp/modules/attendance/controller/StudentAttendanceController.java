package com.sac.erp.modules.attendance.controller;

import com.sac.erp.modules.attendance.dto.BulkStudentAttendanceDto;
import com.sac.erp.modules.attendance.entity.StudentAttendance;
import com.sac.erp.modules.attendance.service.AttendanceService;
import com.sac.erp.modules.attendance.repository.StudentAttendanceRepository;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import com.sac.erp.modules.academic.repository.SectionRepository;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.modules.student.repository.StudentRecordRepository;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.entity.StudentRecord;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/attendance/students")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final AttendanceService attendanceService;
    private final StudentAttendanceRepository attendanceRepository;
    private final ClassRecordRepository classRepository;
    private final SectionRepository sectionRepository;
    private final StudentRepository studentRepository;
    private final StudentRecordRepository studentRecordRepository;
    private final ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> saveStudentAttendance(@RequestBody Map<String, Object> payload) {
        if (payload.containsKey("attendances")) {
            log.info("REST request to save bulk student attendance registry");
            BulkStudentAttendanceDto dto = objectMapper.convertValue(payload, BulkStudentAttendanceDto.class);
            attendanceService.saveStudentAttendance(dto);
            return ResponseEntity.ok().build();
        } else {
            log.info("REST request to save single student attendance (CRUD)");
            String className = (String) payload.get("className");
            String sectionName = (String) payload.get("sectionName");
            String dateStr = (String) payload.get("date");
            LocalDate date = dateStr != null ? LocalDate.parse(dateStr) : LocalDate.now();

            ClassRecord classRecord = classRepository.findByClassName(className)
                .orElseGet(() -> {
                    ClassRecord newClass = new ClassRecord();
                    newClass.setClassName(className);
                    newClass.setActiveStatus(1);
                    return classRepository.save(newClass);
                });

            Section section = sectionRepository.findBySectionName(sectionName)
                .orElseGet(() -> {
                    Section newSection = new Section();
                    newSection.setSectionName(sectionName);
                    newSection.setActiveStatus(1);
                    return sectionRepository.save(newSection);
                });

            Student student = studentRepository.findById(1L)
                .orElseGet(() -> studentRepository.findAll().stream().findFirst().orElse(null));

            StudentRecord record = null;
            if (student != null) {
                record = studentRecordRepository.findByStudent(student).stream()
                    .filter(r -> r.getClassRecord().getId().equals(classRecord.getId())
                            && r.getSection().getId().equals(section.getId()))
                    .findFirst()
                    .orElseGet(() -> {
                        StudentRecord r = new StudentRecord();
                        r.setStudent(student);
                        r.setClassRecord(classRecord);
                        r.setSection(section);
                        r.setActiveStatus(1);
                        return studentRecordRepository.save(r);
                    });
            }

            StudentAttendance attendance = new StudentAttendance();
            attendance.setClassRecord(classRecord);
            attendance.setSection(section);
            attendance.setAttendanceDate(date);
            attendance.setStudent(student);
            attendance.setStudentRecord(record);
            attendance.setAttendanceType("P");
            attendance.setActiveStatus(1);

            return ResponseEntity.ok(attendanceRepository.save(attendance));
        }
    }

    @GetMapping
    public ResponseEntity<List<StudentAttendance>> getStudentAttendanceReport(
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(value = "classId", required = false) Long classId,
            @RequestParam(value = "sectionId", required = false) Long sectionId) {
        if (date == null || classId == null || sectionId == null) {
            log.info("REST request to get all student attendance records");
            return ResponseEntity.ok(attendanceRepository.findAll());
        }
        log.info("REST request to get student attendance report for Date : {} Class : {} Section : {}", date, classId, sectionId);
        List<StudentAttendance> report = attendanceService.getStudentAttendanceReport(date, classId, sectionId);
        return ResponseEntity.ok(report);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentAttendance> updateAttendance(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        log.info("REST request to update student attendance record: {}", id);
        StudentAttendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Attendance not found with id: " + id));

        String className = (String) payload.get("className");
        String sectionName = (String) payload.get("sectionName");
        String dateStr = (String) payload.get("date");

        if (dateStr != null) {
            attendance.setAttendanceDate(LocalDate.parse(dateStr));
        }

        if (className != null) {
            ClassRecord classRecord = classRepository.findByClassName(className)
                .orElseGet(() -> {
                    ClassRecord newClass = new ClassRecord();
                    newClass.setClassName(className);
                    newClass.setActiveStatus(1);
                    return classRepository.save(newClass);
                });
            attendance.setClassRecord(classRecord);
        }

        if (sectionName != null) {
            Section section = sectionRepository.findBySectionName(sectionName)
                .orElseGet(() -> {
                    Section newSection = new Section();
                    newSection.setSectionName(sectionName);
                    newSection.setActiveStatus(1);
                    return sectionRepository.save(newSection);
                });
            attendance.setSection(section);
        }

        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        log.info("REST request to delete student attendance record: {}", id);
        StudentAttendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Attendance not found with id: " + id));
        attendanceRepository.delete(attendance);
        return ResponseEntity.noContent().build();
    }
}
