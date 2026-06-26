package com.sac.erp.modules.exam.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_question_banks")
public class QuestionBank extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "question")
    private String question;

    @Column(name = "marks")
    private Integer marks;

    @Column(name = "trueFalse")
    private String trueFalse;

    @Column(name = "suitable_words")
    private String suitableWords;

    @Column(name = "number_of_option")
    private String numberOfOption;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "q_group_id")
    private Long qGroupId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "shift_id")
    private Long shiftId;
}
