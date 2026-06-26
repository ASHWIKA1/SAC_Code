package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.FrontExamRoutine;
import java.util.List;

public interface FrontExamRoutineService {
    List<FrontExamRoutine> getAll();
    FrontExamRoutine getById(Long id);
    FrontExamRoutine create(FrontExamRoutine entity);
    FrontExamRoutine update(Long id, FrontExamRoutine entity);
    void delete(Long id);
}
