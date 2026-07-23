package com.sac.erp.modules.exam.controller;

import com.sac.erp.modules.exam.dto.BulkMarksEntryDto;
import com.sac.erp.modules.exam.service.ExamService;
import com.sac.erp.modules.exam.entity.MarkStore;
import com.sac.erp.modules.exam.repository.MarkStoreRepository;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.academic.repository.SubjectRepository;
import com.sac.erp.modules.academic.entity.Subject;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import com.sac.erp.modules.academic.repository.SectionRepository;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.student.repository.StudentRecordRepository;
import com.sac.erp.modules.student.entity.StudentRecord;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamManagementController {

    private final ExamService examService;
    private final MarkStoreRepository markStoreRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRecordRepository classRepository;
    private final SectionRepository sectionRepository;
    private final StudentRecordRepository studentRecordRepository;
    private final ObjectMapper objectMapper;

    @GetMapping("/marks")
    public ResponseEntity<List<MarkStore>> getAllMarks() {
        log.info("REST request to get all student marks (CRUD)");
        return ResponseEntity.ok(markStoreRepository.findAll());
    }

    @PostMapping("/marks")
    public ResponseEntity<?> saveStudentMarks(@RequestBody Map<String, Object> payload) {
        if (payload.containsKey("marks") && payload.get("marks") instanceof List) {
            log.info("REST request to save bulk student marks registry");
            BulkMarksEntryDto dto = objectMapper.convertValue(payload, BulkMarksEntryDto.class);
            examService.saveStudentMarks(dto);
            return ResponseEntity.ok().build();
        } else {
            log.info("REST request to save single student mark (CRUD)");
            String studentName = (String) payload.get("studentName");
            String subjectName = (String) payload.get("subjectName");
            Number marksNum = (Number) payload.get("marks");
            Double marks = marksNum != null ? marksNum.doubleValue() : 0.0;

            // Resolve student
            Student student = null;
            if (studentName != null && !studentName.trim().isEmpty()) {
                String[] parts = studentName.trim().split("\\s+");
                String firstName = parts[0];
                student = studentRepository.findAll().stream()
                        .filter(s -> s.getFirstName().equalsIgnoreCase(firstName))
                        .findFirst()
                        .orElse(null);
            }
            if (student == null) {
                student = studentRepository.findById(1L)
                        .orElseGet(() -> studentRepository.findAll().stream().findFirst().orElse(null));
            }

            // Resolve subject
            Subject subject = null;
            if (subjectName != null && !subjectName.trim().isEmpty()) {
                subject = subjectRepository.findBySubjectName(subjectName)
                        .orElseGet(() -> {
                            Subject s = new Subject();
                            s.setSubjectName(subjectName);
                            s.setSubjectCode(subjectName.toUpperCase().substring(0, Math.min(subjectName.length(), 4)));
                            s.setSubjectType(Subject.SubjectType.T);
                            s.setActiveStatus(1);
                            return subjectRepository.save(s);
                        });
            }

            // Resolve class & section
            ClassRecord classRecord = classRepository.findAll().stream().findFirst()
                    .orElseGet(() -> {
                        ClassRecord c = new ClassRecord();
                        c.setClassName("Class 10");
                        c.setActiveStatus(1);
                        return classRepository.save(c);
                    });
            Section section = sectionRepository.findAll().stream().findFirst()
                    .orElseGet(() -> {
                        Section s = new Section();
                        s.setSectionName("A");
                        s.setActiveStatus(1);
                        return sectionRepository.save(s);
                    });

            // Find or create student record
            StudentRecord record = null;
            if (student != null) {
                final Student finalStudent = student;
                record = studentRecordRepository.findByStudent(student).stream()
                    .filter(r -> r.getClassRecord().getId().equals(classRecord.getId())
                            && r.getSection().getId().equals(section.getId()))
                    .findFirst()
                    .orElseGet(() -> {
                        StudentRecord r = new StudentRecord();
                        r.setStudent(finalStudent);
                        r.setClassRecord(classRecord);
                        r.setSection(section);
                        r.setActiveStatus(1);
                        return studentRecordRepository.save(r);
                    });
            }

            MarkStore markStore = new MarkStore();
            markStore.setStudent(student);
            markStore.setStudentRecord(record);
            markStore.setClassRecord(classRecord);
            markStore.setSection(section);
            markStore.setSubject(subject);
            markStore.setTotalMarks(marks);
            markStore.setIsAbsent(0);
            markStore.setActiveStatus(1);

            return ResponseEntity.ok(markStoreRepository.save(markStore));
        }
    }

    @PutMapping("/marks/{id}")
    public ResponseEntity<MarkStore> updateStudentMark(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        log.info("REST request to update student mark record: {}", id);
        MarkStore markStore = markStoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student mark record not found with id: " + id));

        String studentName = (String) payload.get("studentName");
        String subjectName = (String) payload.get("subjectName");
        Number marksNum = (Number) payload.get("marks");

        if (marksNum != null) {
            markStore.setTotalMarks(marksNum.doubleValue());
        }

        if (studentName != null) {
            String[] parts = studentName.trim().split("\\s+");
            String firstName = parts[0];
            Student student = studentRepository.findAll().stream()
                    .filter(s -> s.getFirstName().equalsIgnoreCase(firstName))
                    .findFirst()
                    .orElse(null);
            if (student != null) {
                markStore.setStudent(student);
            }
        }

        if (subjectName != null) {
            Subject subject = subjectRepository.findBySubjectName(subjectName)
                    .orElseGet(() -> {
                        Subject s = new Subject();
                        s.setSubjectName(subjectName);
                        s.setSubjectCode(subjectName.toUpperCase().substring(0, Math.min(subjectName.length(), 4)));
                        s.setSubjectType(Subject.SubjectType.T);
                        s.setActiveStatus(1);
                        return subjectRepository.save(s);
                    });
            markStore.setSubject(subject);
        }

        return ResponseEntity.ok(markStoreRepository.save(markStore));
    }

    @DeleteMapping("/marks/{id}")
    public ResponseEntity<Void> deleteStudentMark(@PathVariable Long id) {
        log.info("REST request to delete student mark record: {}", id);
        MarkStore markStore = markStoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student mark record not found with id: " + id));
        markStoreRepository.delete(markStore);
        return ResponseEntity.noContent().build();
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
