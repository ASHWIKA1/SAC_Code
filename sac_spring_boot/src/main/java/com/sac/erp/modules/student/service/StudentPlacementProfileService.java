package com.sac.erp.modules.student.service;

import com.sac.erp.modules.student.entity.StudentPlacementProfile;
import java.util.List;

public interface StudentPlacementProfileService {
    List<StudentPlacementProfile> getAll();
    StudentPlacementProfile getById(Long id);
    StudentPlacementProfile create(StudentPlacementProfile entity);
    StudentPlacementProfile update(Long id, StudentPlacementProfile entity);
    void delete(Long id);
}
