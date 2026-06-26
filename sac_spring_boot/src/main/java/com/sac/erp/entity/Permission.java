package com.sac.erp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "permissions")
public class Permission extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String module;

    @Column(name = "sidebar_menu")
    private String sidebarMenu;

    @Column(name = "section_id")
    private Integer sectionId = 1;

    @Column(name = "parent_id")
    private Long parentId = 0L;

    private String name;
    private String route;

    @Column(name = "parent_route")
    private String parentRoute;

    private Integer type; // 1 = menu, 2 = submenu, 3 = action

    @Column(name = "lang_name")
    private String langName;

    @Column(columnDefinition = "TEXT")
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String svg;

    private Integer status = 1;

    @Column(name = "menu_status")
    private Integer menuStatus = 1;

    private Integer position = 1;

    @Column(name = "is_saas")
    private Integer isSaas = 0;
    @Column(name = "school_id")
    private String schoolId;
}
