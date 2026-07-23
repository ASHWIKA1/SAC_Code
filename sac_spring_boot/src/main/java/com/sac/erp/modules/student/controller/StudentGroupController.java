package com.sac.erp.modules.student.controller;

import com.sac.erp.modules.student.entity.StudentGroup;
import com.sac.erp.modules.student.repository.StudentGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/students/groups")
@RequiredArgsConstructor
public class StudentGroupController {

    private final StudentGroupRepository studentGroupRepository;

    @GetMapping
    public ResponseEntity<List<StudentGroup>> getAllGroups() {
        log.info("REST request to get all Student Groups");
        return ResponseEntity.ok(studentGroupRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<StudentGroup> createGroup(@RequestBody StudentGroup studentGroup) {
        log.info("REST request to create Student Group: {}", studentGroup.getGroupName());
        studentGroup.setActiveStatus(1);
        return ResponseEntity.ok(studentGroupRepository.save(studentGroup));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentGroup> updateGroup(@PathVariable Long id, @RequestBody StudentGroup studentGroupDetails) {
        log.info("REST request to update Student Group: {}", id);
        StudentGroup group = studentGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Group not found with id: " + id));
        group.setGroupName(studentGroupDetails.getGroupName());
        return ResponseEntity.ok(studentGroupRepository.save(group));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        log.info("REST request to delete Student Group: {}", id);
        StudentGroup group = studentGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Group not found with id: " + id));
        studentGroupRepository.delete(group);
        return ResponseEntity.noContent().build();
    }
}
