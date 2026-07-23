package com.sac.erp.modules.homework.service;

import com.sac.erp.modules.homework.entity.*;
import java.util.List;

public interface HomeworkService {
    List<Homework> getAllHomeworks();
    List<Homework> getHomeworksByClassSection(Long classId, Long sectionId);
    Homework createHomework(Homework homework);

    HomeworkStudent submitHomework(Long homeworkId, Long studentId, String file);
    HomeworkStudent evaluateHomework(Long homeworkId, Long studentId, String marks, String status);
    HomeworkStudent evaluateHomework(Long homeworkId, Long studentId, String marks, String status, String feedbackFile);
    List<HomeworkStudent> getSubmissionsByHomework(Long homeworkId);
}
