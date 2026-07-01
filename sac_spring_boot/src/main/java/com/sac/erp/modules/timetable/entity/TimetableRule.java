package com.sac.erp.modules.timetable.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "timetable_rules")
public class TimetableRule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "required_periods", nullable = false)
    private Integer requiredPeriods = 1;
    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
