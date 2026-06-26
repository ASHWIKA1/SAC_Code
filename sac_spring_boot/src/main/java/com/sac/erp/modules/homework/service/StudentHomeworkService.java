package com.sac.erp.modules.homework.service;

import com.sac.erp.modules.homework.entity.StudentHomework;
import java.util.List;

public interface StudentHomeworkService {
    List<StudentHomework> getAll();
    StudentHomework getById(Long id);
    StudentHomework create(StudentHomework entity);
    StudentHomework update(Long id, StudentHomework entity);
    void delete(Long id);
}
