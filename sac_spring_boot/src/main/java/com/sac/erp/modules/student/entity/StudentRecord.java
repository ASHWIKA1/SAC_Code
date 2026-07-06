package com.sac.erp.modules.student.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "student_records")
public class StudentRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassRecord classRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "roll_no")
    private String rollNo;

    @Column(name = "is_promote")
    private Boolean isPromote = false;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
