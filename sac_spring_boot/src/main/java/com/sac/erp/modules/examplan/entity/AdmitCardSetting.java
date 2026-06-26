package com.sac.erp.modules.examplan.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "admit_card_settings")
public class AdmitCardSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "logo")
    private String logo;

    @Column(name = "heading", columnDefinition = "TEXT")
    private String heading;

    @Column(name = "signature")
    private String signature;

    @Column(name = "show_photo")
    private Integer showPhoto = 1;

    @Column(name = "show_exam_schedule")
    private Integer showExamSchedule = 1;
    @Column(name = "school_id")
    private String schoolId;
}
