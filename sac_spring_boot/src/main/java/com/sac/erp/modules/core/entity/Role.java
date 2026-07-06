package com.sac.erp.modules.core.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // e.g. system, custom

    @Column(name = "active_status")
    private Integer activeStatus = 1;

    @Column(name = "school_id")
    private Long schoolId;
}

