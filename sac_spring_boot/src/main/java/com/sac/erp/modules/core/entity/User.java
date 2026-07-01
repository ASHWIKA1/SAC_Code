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

    @Column(name = "full_name")
    private String name;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phone;

    @Column(name = "is_administrator", columnDefinition = "varchar(3) default 'no'")
    private String isAdministrator = "no";

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
