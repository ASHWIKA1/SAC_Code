package com.sac.erp.modules.whatsapp.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "agent_times")
public class WhatsappAgentTime extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "agent_id")
    private Long agentId;

    @Column(name = "`day`")
    private String day; // Monday, Tuesday, etc.

    @Column(name = "`start`")
    private String start; // HH:mm

    @Column(name = "`end`")
    private String end;   // HH:mm
}
