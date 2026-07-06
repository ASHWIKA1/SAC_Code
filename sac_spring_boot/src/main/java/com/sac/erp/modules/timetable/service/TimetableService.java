package com.sac.erp.modules.timetable.service;

import com.sac.erp.modules.timetable.entity.*;
import java.util.List;

public interface TimetableService {
    List<ClassRoutine> getRoutines(Long classId, Long sectionId);
    ClassRoutine saveRoutine(ClassRoutine routine);

    List<ClassRoutineUpdate> getRoutineUpdates(Long classId, Long sectionId);
    ClassRoutineUpdate addRoutineUpdate(ClassRoutineUpdate update);

    List<TimetableRule> getRules(Long classId, Long sectionId);
    TimetableRule saveRule(TimetableRule rule);

    TimetableTeacherConstraint getTeacherConstraint(Long teacherId);
    TimetableTeacherConstraint saveTeacherConstraint(TimetableTeacherConstraint constraint);
}
