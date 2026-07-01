package com.sac.erp.modules.timetable.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "sm_class_routine_updates")
public class ClassRoutineUpdate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "`day`")
    private Integer day;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "is_break")
    private Integer isBreak = 0;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "class_period_id")
    private Long classPeriodId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;
    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "shift_id")
    private Integer shiftId;
}
