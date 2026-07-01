package com.sac.erp.modules.academic.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_student_promotions")
public class StudentPromotion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "result_status")
    private String resultStatus;

    @Column(name = "previous_class_id")
    private Long previousClassId;

    @Column(name = "current_class_id")
    private Long currentClassId;

    @Column(name = "previous_section_id")
    private Long previousSectionId;

    @Column(name = "current_section_id")
    private Long currentSectionId;

    @Column(name = "previous_session_id")
    private Long previousSessionId;

    @Column(name = "current_session_id")
    private Long currentSessionId;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "admission_number")
    private Integer admissionNumber;

    @Column(name = "student_info")
    private String studentInfo;

    @Column(name = "merit_student_info")
    private String meritStudentInfo;

    @Column(name = "previous_roll_number")
    private Integer previousRollNumber;

    @Column(name = "current_roll_number")
    private Integer currentRollNumber;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "previous_shift_id")
    private Long previousShiftId;

    @Column(name = "current_shift_id")
    private Long currentShiftId;
}
