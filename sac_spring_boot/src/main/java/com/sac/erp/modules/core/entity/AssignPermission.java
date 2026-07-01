package com.sac.erp.modules.core.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "assign_permissions")
public class AssignPermission extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id")
    private Permission permission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    private Integer status = 1;

    @Column(name = "menu_status")
    private Integer menuStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
