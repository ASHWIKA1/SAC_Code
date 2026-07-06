package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.entity.AssignClassTeacher;
import java.util.List;

public interface AssignClassTeacherService {
    List<AssignClassTeacher> getAll();
    AssignClassTeacher getById(Long id);
    AssignClassTeacher create(AssignClassTeacher entity);
    AssignClassTeacher update(Long id, AssignClassTeacher entity);
    void delete(Long id);
}
