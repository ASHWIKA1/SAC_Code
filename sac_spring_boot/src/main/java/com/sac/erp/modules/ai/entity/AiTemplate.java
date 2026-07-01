package com.sac.erp.modules.ai.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ai_templates")
public class AiTemplate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "icon")
    private String icon;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private Integer status = 1;
}
