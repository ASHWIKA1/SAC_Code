package com.sac.erp.modules.core.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_menus")
public class Menu extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String module;
    private String route;

    @Column(name = "lang_name")
    private String langName;

    @Column(name = "section_id")
    private Long sectionId;

    private String icon;
    private Integer status;

    @Column(name = "is_saas")
    private Integer isSaas;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "menu_status")
    private Integer menuStatus;

    @Column(name = "permission_section")
    private Integer permissionSection;

    private Integer position;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "permission_id")
    private Long permissionId;
    @Column(name = "school_id")
    private String schoolId;
}
