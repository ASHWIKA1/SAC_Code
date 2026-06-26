package com.sac.erp.modules.timetable.service;

import com.sac.erp.modules.timetable.entity.FrontClassRoutine;
import java.util.List;

public interface FrontClassRoutineService {
    List<FrontClassRoutine> getAll();
    FrontClassRoutine getById(Long id);
    FrontClassRoutine create(FrontClassRoutine entity);
    FrontClassRoutine update(Long id, FrontClassRoutine entity);
    void delete(Long id);
}
