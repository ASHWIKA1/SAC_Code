package com.sac.erp.modules.homework.service;

import com.sac.erp.modules.homework.entity.*;
import com.sac.erp.modules.homework.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeworkServiceImpl implements HomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final HomeworkStudentRepository homeworkStudentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Homework> getAllHomeworks() {
        return homeworkRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Homework> getHomeworksByClassSection(Long classId, Long sectionId) {
        return homeworkRepository.findByClassIdAndSectionIdAndActiveStatus(classId, sectionId, 1);
    }

    @Override
    @Transactional
    public Homework createHomework(Homework homework) {
        if (homework.getHomeworkDate() == null) {
            homework.setHomeworkDate(LocalDate.now());
        }
        return homeworkRepository.save(homework);
    }

    @Override
    @Transactional
    public HomeworkStudent submitHomework(Long homeworkId, Long studentId, String file) {
        homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new RuntimeException("Homework assignment not found"));

        HomeworkStudent sub = homeworkStudentRepository.findByHomeworkIdAndStudentId(homeworkId, studentId)
                .orElse(new HomeworkStudent());

        sub.setHomeworkId(homeworkId);
        sub.setStudentId(studentId);
        sub.setFile(file);
        sub.setCompleteStatus("C"); // Completed/Submitted
        sub.setActiveStatus(1);

        return homeworkStudentRepository.save(sub);
    }

    @Override
    @Transactional
    public HomeworkStudent evaluateHomework(Long homeworkId, Long studentId, String marks, String status) {
        HomeworkStudent sub = homeworkStudentRepository.findByHomeworkIdAndStudentId(homeworkId, studentId)
                .orElseThrow(() -> new RuntimeException("Student homework submission not found"));

        sub.setMarks(marks);
        if (status != null) {
            sub.setCompleteStatus(status);
        }

        return homeworkStudentRepository.save(sub);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeworkStudent> getSubmissionsByHomework(Long homeworkId) {
        return homeworkStudentRepository.findByHomeworkId(homeworkId);
    }
}
