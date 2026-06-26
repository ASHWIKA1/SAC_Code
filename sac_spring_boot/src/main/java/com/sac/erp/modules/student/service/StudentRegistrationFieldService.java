package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.entity.StudentRegistrationField;
import java.util.List;

public interface StudentRegistrationFieldService {
    List<StudentRegistrationField> getAll();
    StudentRegistrationField getById(Long id);
    StudentRegistrationField create(StudentRegistrationField entity);
    StudentRegistrationField update(Long id, StudentRegistrationField entity);
    void delete(Long id);
}
