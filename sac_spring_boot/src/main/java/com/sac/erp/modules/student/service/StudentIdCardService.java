package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.entity.StudentIdCard;
import java.util.List;

public interface StudentIdCardService {
    List<StudentIdCard> getAll();
    StudentIdCard getById(Long id);
    StudentIdCard create(StudentIdCard entity);
    StudentIdCard update(Long id, StudentIdCard entity);
    void delete(Long id);
}
