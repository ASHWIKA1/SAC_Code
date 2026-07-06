package com.sac.erp.modules.chat.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_block_users")
public class ChatBlockUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "block_by", nullable = false)
    private Long blockBy;

    @Column(name = "block_to", nullable = false)
    private Long blockTo;
}
