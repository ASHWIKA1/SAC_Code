package com.sac.erp.modules.student.controller;

import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Student>> getStudents() {
        String currentTenant = TenantContext.getCurrentTenant();
        log.info("Fetching students for tenant/school: {}", currentTenant);
        // Hibernate automatic tenant filtering will restrict this to current school_id
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    @PostMapping
    public ResponseEntity<Student> admitStudent(@RequestBody Student student) {
        log.info("Admitting new student: {} {}", student.getFirstName(), student.getLastName());
        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    }
}
