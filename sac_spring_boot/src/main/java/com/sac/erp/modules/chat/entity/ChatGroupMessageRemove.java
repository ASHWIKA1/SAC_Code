package com.sac.erp.modules.chat.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_group_message_removes")
public class ChatGroupMessageRemove extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_message_recipient_id", nullable = false)
    private Long groupMessageRecipientId;

    @Column(name = "user_id", nullable = false)
    private Long userId;
}
