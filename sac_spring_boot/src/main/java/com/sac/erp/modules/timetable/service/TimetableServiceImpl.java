package com.sac.erp.modules.timetable.service;

import com.sac.erp.modules.timetable.entity.*;
import com.sac.erp.modules.timetable.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final ClassRoutineRepository routineRepository;
    private final ClassRoutineUpdateRepository routineUpdateRepository;
    private final TimetableRuleRepository ruleRepository;
    private final TimetableTeacherConstraintRepository constraintRepository;

    @Override
    public List<ClassRoutine> getRoutines(Long classId, Long sectionId) {
        return routineRepository.findByClassIdAndSectionId(classId, sectionId);
    }

    @Override
    public ClassRoutine saveRoutine(ClassRoutine routine) {
        return routineRepository.save(routine);
    }

    @Override
    public List<ClassRoutineUpdate> getRoutineUpdates(Long classId, Long sectionId) {
        return routineUpdateRepository.findByClassIdAndSectionId(classId, sectionId);
    }

    @Override
    @Transactional
    public ClassRoutineUpdate addRoutineUpdate(ClassRoutineUpdate update) {
        if (update.getTeacherId() != null && update.getDay() != null) {
            // Check double-booking conflicts
            List<ClassRoutineUpdate> teacherSchedules = routineUpdateRepository.findByTeacherIdAndDay(update.getTeacherId(), update.getDay());
            for (ClassRoutineUpdate existing : teacherSchedules) {
                if (existing.getClassPeriodId() != null && existing.getClassPeriodId().equals(update.getClassPeriodId())) {
                    throw new IllegalArgumentException("Teacher conflict: Teacher is already teaching during this class period on this day");
                }
            }

            // Check max limits constraints
            TimetableTeacherConstraint constraint = constraintRepository.findByTeacherId(update.getTeacherId())
                .orElseGet(() -> {
                    TimetableTeacherConstraint tc = new TimetableTeacherConstraint();
                    tc.setTeacherId(update.getTeacherId());
                    return tc;
                });

            long periodsToday = teacherSchedules.size();
            if (periodsToday >= constraint.getMaxPeriodsPerDay()) {
                throw new IllegalArgumentException("Teacher conflict: Exceeds maximum periods per day (" + constraint.getMaxPeriodsPerDay() + ")");
            }
        }

        return routineUpdateRepository.save(update);
    }

    @Override
    public List<TimetableRule> getRules(Long classId, Long sectionId) {
        return ruleRepository.findByClassIdAndSectionId(classId, sectionId);
    }

    @Override
    public TimetableRule saveRule(TimetableRule rule) {
        return ruleRepository.save(rule);
    }

    @Override
    public TimetableTeacherConstraint getTeacherConstraint(Long teacherId) {
        return constraintRepository.findByTeacherId(teacherId).orElseGet(() -> {
            TimetableTeacherConstraint tc = new TimetableTeacherConstraint();
            tc.setTeacherId(teacherId);
            return constraintRepository.save(tc);
        });
    }

    @Override
    public TimetableTeacherConstraint saveTeacherConstraint(TimetableTeacherConstraint constraint) {
        return constraintRepository.save(constraint);
    }
}
