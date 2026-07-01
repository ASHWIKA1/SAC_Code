package com.sac.erp.modules.whatsapp.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "agents")
public class WhatsappAgent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "always_available")
    private Boolean alwaysAvailable = false;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
}
