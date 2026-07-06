package com.sac.erp.modules.chat.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "chat_group_users")
public class ChatGroupUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", length = 36, nullable = false)
    private String groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer role = 1; // 1 => Member, 2 => Admin

    @Column(name = "added_by", nullable = false)
    private Long addedBy;

    @Column(name = "removed_by")
    private Long removedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
