package com.sac.erp.modules.lms.controller;

import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Subject;
import com.sac.erp.modules.academic.entity.AssignSubject;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import com.sac.erp.modules.academic.repository.SubjectRepository;
import com.sac.erp.modules.academic.repository.AssignSubjectRepository;
import com.sac.erp.modules.core.entity.User;
import com.sac.erp.modules.core.repository.UserRepository;
import com.sac.erp.modules.hr.entity.Staff;
import com.sac.erp.modules.hr.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final ClassRecordRepository classRecordRepository;
    private final SubjectRepository subjectRepository;
    private final AssignSubjectRepository assignSubjectRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    @GetMapping({"/assignment/courses", "/api/v1/lms/assignment/courses"})
    public ResponseEntity<List<Map<String, Object>>> getCourses(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("Request to get courses for assignments portal");
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = Boolean.TRUE.equals(user.getIsAdministrator());
        boolean isSuperAdmin = user.getRole() != null && ("SUPERADMIN".equalsIgnoreCase(user.getRole().getName()) || "SUPER_ADMIN".equalsIgnoreCase(user.getRole().getName()));
        boolean isSchoolAdmin = user.getRole() != null && ("ADMIN".equalsIgnoreCase(user.getRole().getName()) || "school_admin".equalsIgnoreCase(user.getRole().getName()));

        List<ClassRecord> classes;
        if (isAdmin || isSuperAdmin || isSchoolAdmin) {
            classes = classRecordRepository.findByActiveStatus(1);
        } else {
            Staff staff = staffRepository.findByUserId(user.getId()).orElse(null);
            if (staff == null) {
                staff = staffRepository.findByActiveStatus(1).stream()
                        .filter(s -> s.getEmail() != null && s.getEmail().equalsIgnoreCase(user.getEmail()))
                        .findFirst().orElse(null);
            }

            if (staff != null) {
                List<AssignSubject> assignments = assignSubjectRepository.findByTeacherId(staff.getId());
                classes = assignments.stream()
                        .map(AssignSubject::getClassRecord)
                        .filter(c -> c != null && c.getActiveStatus() == 1)
                        .distinct()
                        .collect(Collectors.toList());
            } else {
                classes = new ArrayList<>();
            }
        }

        List<Map<String, Object>> response = classes.stream()
                .map(c -> Map.of(
                        "id", (Object) c.getId(),
                        "name", (Object) c.getClassName()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping({"/assignment/subjects/{course_id}", "/api/v1/lms/assignment/subjects/{course_id}"})
    public ResponseEntity<List<Map<String, Object>>> getSubjects(
            @PathVariable("course_id") Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Request to get subjects for course id {}", courseId);
        
        List<Subject> subjects = subjectRepository.findByCourseId(courseId);
        
        if (subjects.isEmpty()) {
            List<AssignSubject> assignments = assignSubjectRepository.findAll();
            subjects = assignments.stream()
                    .filter(a -> a.getClassRecord() != null && a.getClassRecord().getId().equals(courseId))
                    .map(AssignSubject::getSubject)
                    .filter(s -> s != null && s.getActiveStatus() == 1)
                    .distinct()
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> response = subjects.stream()
                .map(s -> Map.of(
                        "id", (Object) s.getId(),
                        "name", (Object) s.getSubjectName()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
