package com.sac.erp.modules.student.controller;

import com.sac.erp.modules.student.dto.StudentAdmissionDto;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentManagementController {

    private final StudentService studentService;

    @PostMapping("/admit")
    public ResponseEntity<Student> admitStudent(@Valid @RequestBody StudentAdmissionDto dto) {
        log.info("REST request to admit new student: {}", dto.getAdmissionNo());
        Student student = studentService.admitStudent(dto);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Student>> getStudents(
            @RequestParam("classId") Long classId,
            @RequestParam("sectionId") Long sectionId) {
        log.info("REST request to filter students by Class : {} Section : {}", classId, sectionId);
        List<Student> students = studentService.getStudentsByClassAndSection(classId, sectionId);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        log.info("REST request to get Student : {}", id);
        return ResponseEntity.ok(studentService.getStudentById(id));
    }
}
