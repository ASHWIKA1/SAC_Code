package com.sac.erp.modules.student.entity;

import com.sac.erp.entity.BaseEntity;
import com.sac.erp.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_parents")
public class Parent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fathers_name")
    private String fathersName;

    @Column(name = "fathers_mobile")
    private String fathersMobile;

    @Column(name = "fathers_occupation")
    private String fathersOccupation;

    @Column(name = "fathers_photo")
    private String fathersPhoto;

    @Column(name = "mothers_name")
    private String mothersName;

    @Column(name = "mothers_mobile")
    private String mothersMobile;

    @Column(name = "mothers_occupation")
    private String mothersOccupation;

    @Column(name = "mothers_photo")
    private String mothersPhoto;

    private String relation;

    @Column(name = "guardians_name")
    private String guardiansName;

    @Column(name = "guardians_mobile")
    private String guardiansMobile;

    @Column(name = "guardians_email")
    private String guardiansEmail;

    @Column(name = "guardians_occupation")
    private String guardiansOccupation;

    @Column(name = "guardians_relation")
    private String guardiansRelation;

    @Column(name = "guardians_photo")
    private String guardiansPhoto;

    @Column(name = "guardians_address")
    private String guardiansAddress;

    @Column(name = "is_guardian")
    private Integer isGuardian;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
