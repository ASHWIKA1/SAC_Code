package com.sac.erp.modules.superadmin.controller;

import com.sac.erp.modules.superadmin.entity.School;
import com.sac.erp.modules.superadmin.repository.SchoolRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/superadmin/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolRepository schoolRepository;

    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        log.info("Fetching list of all school tenants");
        return ResponseEntity.ok(schoolRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<School> getSchoolById(@PathVariable Long id) {
        log.info("Fetching details for school ID: {}", id);
        return schoolRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<School> createSchool(@RequestBody School school) {
        log.info("Creating new school tenant: {}", school.getSchoolName());
        School savedSchool = schoolRepository.save(school);
        return ResponseEntity.ok(savedSchool);
    }

    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<School> toggleSchoolStatus(@PathVariable Long id) {
        log.info("Toggling active status for school ID: {}", id);
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found"));
        
        school.setActiveStatus(school.getActiveStatus() == 1 ? 0 : 1);
        School updatedSchool = schoolRepository.save(school);
        return ResponseEntity.ok(updatedSchool);
    }
}
