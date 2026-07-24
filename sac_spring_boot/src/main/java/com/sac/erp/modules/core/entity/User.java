package com.sac.erp.modules.core.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "is_administrator")
    private Boolean isAdministrator = false;

    @Column(name = "active_status")
    private Integer activeStatus = 1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "school_id")
    private Long schoolId;

    @Column(name = "device_token")
    private String deviceToken;

    @Column(name = "usertype")
    private String usertype;
}
