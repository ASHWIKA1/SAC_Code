package com.sac.erp.modules.admin.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_setup_admins")
public class SetupAdmin extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type")
    private Integer type;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
