package com.sac.erp.modules.core.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "two_factor_settings")
public class TwoFactorSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "via_sms", nullable = false)
    private Boolean viaSms = false;

    @Column(name = "via_email", nullable = false)
    private Boolean viaEmail = true;

    @Column(name = "for_student", nullable = false)
    private Integer forStudent = 2;

    @Column(name = "for_parent", nullable = false)
    private Integer forParent = 3;

    @Column(name = "for_teacher", nullable = false)
    private Integer forTeacher = 4;

    @Column(name = "for_staff", nullable = false)
    private Integer forStaff = 6;

    @Column(name = "for_admin", nullable = false)
    private Integer forAdmin = 1;

    @Column(name = "expired_time", nullable = false)
    private Double expiredTime = 300.0;
    @Column(name = "school_id")
    private String schoolId;
}
