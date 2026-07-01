package com.sac.erp.modules.jitsi.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "jitsi_meeting_users")
public class JitsiMeetingUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id", nullable = false)
    private Integer meetingId = 1;

    @Column(name = "user_id", nullable = false)
    private Integer userId = 1;
}
