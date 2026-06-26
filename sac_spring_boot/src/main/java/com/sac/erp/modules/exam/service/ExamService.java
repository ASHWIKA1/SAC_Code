package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.dto.BulkMarksEntryDto;
import com.sac.erp.modules.exam.entity.MarksGrade;

public interface ExamService {
    void saveStudentMarks(BulkMarksEntryDto dto);
    Double calculateStudentGpa(Long studentId, Long classId, Long sectionId);
    MarksGrade getGradeForPercentage(Double percentage);
}
