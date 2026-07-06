package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.entity.Subject;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import com.sac.erp.modules.academic.repository.SectionRepository;
import com.sac.erp.modules.academic.repository.SubjectRepository;
import com.sac.erp.modules.exam.dto.BulkMarksEntryDto;
import com.sac.erp.modules.exam.dto.StudentMarksDto;
import com.sac.erp.modules.exam.entity.ExamSetup;
import com.sac.erp.modules.exam.entity.ExamType;
import com.sac.erp.modules.exam.entity.MarkStore;
import com.sac.erp.modules.exam.entity.MarksGrade;
import com.sac.erp.modules.exam.repository.ExamSetupRepository;
import com.sac.erp.modules.exam.repository.ExamTypeRepository;
import com.sac.erp.modules.exam.repository.MarkStoreRepository;
import com.sac.erp.modules.exam.repository.MarksGradeRepository;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.entity.StudentRecord;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.modules.student.repository.StudentRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final MarkStoreRepository markStoreRepository;
    private final ExamTypeRepository examTypeRepository;
    private final ExamSetupRepository examSetupRepository;
    private final ClassRecordRepository classRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final StudentRecordRepository studentRecordRepository;
    private final MarksGradeRepository marksGradeRepository;

    @Override
    @Transactional
    public void saveStudentMarks(BulkMarksEntryDto dto) {
        log.info("Saving student marks for Exam Term: {}, Subject: {}", dto.getExamTermId(), dto.getSubjectId());

        ClassRecord classRecord = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Section section = sectionRepository.findById(dto.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found"));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        ExamType examType = examTypeRepository.findById(dto.getExamTermId())
                .orElseThrow(() -> new RuntimeException("Exam Term not found"));
        ExamSetup examSetup = examSetupRepository.findById(dto.getExamSetupId())
                .orElseThrow(() -> new RuntimeException("Exam Setup not found"));

        // Load existing marks registers for this subject/examTerm/class/section
        List<MarkStore> existing = markStoreRepository
                .findByExamTerm_IdAndClassRecord_IdAndSection_Id(dto.getExamTermId(), dto.getClassId(), dto.getSectionId());

        for (StudentMarksDto markDto : dto.getMarks()) {
            Student student = studentRepository.findById(markDto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            StudentRecord record = studentRecordRepository.findByStudent(student).stream()
                    .filter(r -> r.getClassRecord().getId().equals(dto.getClassId())
                            && r.getSection().getId().equals(dto.getSectionId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Student enrollment record not found"));

            Optional<MarkStore> match = existing.stream()
                    .filter(m -> m.getStudent().getId().equals(student.getId()) 
                            && m.getSubject().getId().equals(subject.getId()))
                    .findFirst();

            MarkStore markStore;
            if (match.isPresent()) {
                markStore = match.get();
            } else {
                markStore = new MarkStore();
                markStore.setStudent(student);
                markStore.setStudentRecord(record);
                markStore.setClassRecord(classRecord);
                markStore.setSection(section);
                markStore.setSubject(subject);
                markStore.setExamTerm(examType);
                markStore.setExamSetup(examSetup);
            }

            markStore.setStudentRollNo(student.getRollNo());
            markStore.setStudentAdmissionNo(Integer.parseInt(student.getAdmissionNo()));
            markStore.setTotalMarks(markDto.getTotalMarks());
            markStore.setIsAbsent(markDto.getIsAbsent());
            markStore.setTeacherRemarks(markDto.getTeacherRemarks());
            markStore.setAcademicId(dto.getAcademicId());
            markStore.setActiveStatus(1);

            markStoreRepository.save(markStore);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateStudentGpa(Long studentId, Long classId, Long sectionId) {
        log.info("Calculating GPA for Student: {}", studentId);
        List<MarkStore> marks = markStoreRepository.findByStudent_IdAndClassRecord_IdAndSection_Id(studentId, classId, sectionId);
        if (marks.isEmpty()) {
            return 0.0;
        }

        // Calculation logic: get average marks percentage, lookup GPA grade point
        double totalEarned = 0.0;
        double totalPossible = 0.0;

        for (MarkStore mark : marks) {
            if (mark.getIsAbsent() == 1) {
                continue;
            }
            totalEarned += mark.getTotalMarks();
            // Fallback: assume each exam setup carries 100 marks if not specified
            Double examMark = mark.getExamSetup() != null ? mark.getExamSetup().getExamMark() : 100.0;
            totalPossible += (examMark != null ? examMark : 100.0);
        }

        if (totalPossible == 0.0) {
            return 0.0;
        }

        double percentage = (totalEarned / totalPossible) * 100.0;
        MarksGrade grade = getGradeForPercentage(percentage);
        return grade != null ? grade.getGpa() : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public MarksGrade getGradeForPercentage(Double percentage) {
        return marksGradeRepository.findGradeByPercentage(percentage)
                .orElse(null);
    }
}
