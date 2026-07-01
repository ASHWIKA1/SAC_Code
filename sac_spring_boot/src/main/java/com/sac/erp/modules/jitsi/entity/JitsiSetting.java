package com.sac.erp.modules.jitsi.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "jitsi_settings")
public class JitsiSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jitsi_server", nullable = false)
    private String jitsiServer = "https://meet.jit.si/";
}
