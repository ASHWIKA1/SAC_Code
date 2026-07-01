package com.sac.erp.modules.chat.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "chat_conversations")
public class ChatConversation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_id")
    private Long fromId;

    @Column(name = "to_id")
    private Long toId;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private Integer status = 0; // 0 for unread, 1 for seen

    @Column(name = "message_type", nullable = false)
    private Integer messageType = 0; // 0-text, 1-image, 2-pdf, 3-doc, 4-voice

    @Column(name = "file_name", columnDefinition = "TEXT")
    private String fileName;

    @Column(name = "original_file_name", columnDefinition = "TEXT")
    private String originalFileName;

    @Column(nullable = false)
    private Boolean initial = false;

    private Long reply;
    private Long forward;

    @Column(name = "deleted_by_to", nullable = false)
    private Boolean deletedByTo = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
