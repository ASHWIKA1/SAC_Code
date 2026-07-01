package com.sac.erp.modules.exam.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.entity.Subject;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_exam_setups")
public class ExamSetup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_title")
    private String examTitle;

    @Column(name = "exam_mark")
    private Double examMark;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassRecord classRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_term_id")
    private ExamType examTerm;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
