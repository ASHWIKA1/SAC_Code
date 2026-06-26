package com.sac.erp.modules.timetable.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "timetable_teacher_constraints")
public class TimetableTeacherConstraint extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "max_periods_per_day", nullable = false)
    private Integer maxPeriodsPerDay = 5;

    @Column(name = "max_periods_per_week", nullable = false)
    private Integer maxPeriodsPerWeek = 30;
    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
