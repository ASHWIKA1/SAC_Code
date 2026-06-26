package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.dto.StudentAdmissionDto;
import com.sac.erp.modules.student.entity.Student;
import java.util.List;

public interface StudentService {
    Student admitStudent(StudentAdmissionDto dto);
    List<Student> getStudentsByClassAndSection(Long classId, Long sectionId);
    Student getStudentById(Long id);
}
