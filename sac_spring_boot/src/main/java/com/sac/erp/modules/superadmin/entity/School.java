package com.sac.erp.modules.superadmin.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_schools")
public class School extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "school_name", nullable = false)
    private String schoolName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "domain", unique = true)
    private String domain;

    @Column(name = "active_status")
    private Integer activeStatus = 1;

    @Column(name = "school_code")
    private String schoolCode;

    @Column(name = "school_group_id")
    private Long schoolGroupId;
}
