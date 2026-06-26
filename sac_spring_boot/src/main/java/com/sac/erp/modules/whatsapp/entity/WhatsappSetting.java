package com.sac.erp.modules.whatsapp.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "settings")
public class WhatsappSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "agent_type")
    private String agentType = "single"; // single or multi

    @Column(name = "availability")
    private String availability = "both"; // desktop, mobile, both

    @Column(name = "disable_for_admin_panel")
    private Boolean disableForAdminPanel = false;

    @Column(name = "phone")
    private String phone;

    @Column(name = "greeting_message", columnDefinition = "TEXT")
    private String greetingMessage;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
}
