package com.sac.erp;

import com.sac.erp.modules.timetable.entity.ClassRoutineUpdate;
import com.sac.erp.modules.timetable.entity.TimetableTeacherConstraint;
import com.sac.erp.modules.timetable.repository.ClassRoutineRepository;
import com.sac.erp.modules.timetable.repository.ClassRoutineUpdateRepository;
import com.sac.erp.modules.timetable.repository.TimetableRuleRepository;
import com.sac.erp.modules.timetable.repository.TimetableTeacherConstraintRepository;
import com.sac.erp.modules.timetable.service.TimetableServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TimetableServiceTest {

    @Mock private ClassRoutineRepository routineRepository;
    @Mock private ClassRoutineUpdateRepository routineUpdateRepository;
    @Mock private TimetableRuleRepository ruleRepository;
    @Mock private TimetableTeacherConstraintRepository constraintRepository;

    @InjectMocks
    private TimetableServiceImpl timetableService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddRoutineUpdate_Success() {
        ClassRoutineUpdate update = new ClassRoutineUpdate();
        update.setTeacherId(1L);
        update.setDay(1); // Saturday
        update.setClassPeriodId(10L);

        when(routineUpdateRepository.findByTeacherIdAndDay(1L, 1)).thenReturn(Collections.emptyList());
        when(constraintRepository.findByTeacherId(1L)).thenReturn(Optional.empty());
        when(routineUpdateRepository.save(any(ClassRoutineUpdate.class))).thenAnswer(i -> i.getArgument(0));

        ClassRoutineUpdate result = timetableService.addRoutineUpdate(update);

        assertNotNull(result);
        assertEquals(1L, result.getTeacherId());
        verify(routineUpdateRepository, times(1)).save(update);
    }

    @Test
    void testAddRoutineUpdate_TeacherConflict() {
        ClassRoutineUpdate update = new ClassRoutineUpdate();
        update.setTeacherId(1L);
        update.setDay(2); // Sunday
        update.setClassPeriodId(5L);

        ClassRoutineUpdate existing = new ClassRoutineUpdate();
        existing.setTeacherId(1L);
        existing.setDay(2);
        existing.setClassPeriodId(5L); // Double booking conflict!

        when(routineUpdateRepository.findByTeacherIdAndDay(1L, 2)).thenReturn(List.of(existing));

        assertThrows(IllegalArgumentException.class, () -> {
            timetableService.addRoutineUpdate(update);
        });
    }

    @Test
    void testAddRoutineUpdate_MaxPeriodsPerDayExceeded() {
        ClassRoutineUpdate update = new ClassRoutineUpdate();
        update.setTeacherId(1L);
        update.setDay(3); // Monday
        update.setClassPeriodId(15L);

        TimetableTeacherConstraint constraint = new TimetableTeacherConstraint();
        constraint.setTeacherId(1L);
        constraint.setMaxPeriodsPerDay(2); // Maximum 2 periods today

        List<ClassRoutineUpdate> activeSchedules = new ArrayList<>();
        ClassRoutineUpdate s1 = new ClassRoutineUpdate();
        s1.setTeacherId(1L);
        s1.setDay(3);
        s1.setClassPeriodId(1L);
        activeSchedules.add(s1);

        ClassRoutineUpdate s2 = new ClassRoutineUpdate();
        s2.setTeacherId(1L);
        s2.setDay(3);
        s2.setClassPeriodId(2L);
        activeSchedules.add(s2); // Already has 2 periods scheduled!

        when(routineUpdateRepository.findByTeacherIdAndDay(1L, 3)).thenReturn(activeSchedules);
        when(constraintRepository.findByTeacherId(1L)).thenReturn(Optional.of(constraint));

        assertThrows(IllegalArgumentException.class, () -> {
            timetableService.addRoutineUpdate(update);
        });
    }
}
