package com.sac.erp.modules.admin.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_calendar_settings")
public class CalendarSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_name")
    private String menuName;

    @Column(name = "status")
    private Integer status;

    @Column(name = "font_color")
    private String fontColor;

    @Column(name = "bg_color")
    private String bgColor;

    @Column(name = "school_id")
    private String schoolId;
}
