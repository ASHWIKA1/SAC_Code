package com.sac.erp.modules.chat.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_invitations")
public class ChatInvitation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "`from`", nullable = false)
    private Long from;

    @Column(name = "`to`", nullable = false)
    private Long to;

    @Column(nullable = false)
    private Integer status = 0; // 0-pending, 1-connected, 2-blocked
}
