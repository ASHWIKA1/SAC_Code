package com.sac.erp.modules.zoom.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "zoom_settings")
public class ZoomSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "package_id")
    private Integer packageId = 1;

    @Column(name = "host_video")
    private Boolean hostVideo = false;

    @Column(name = "participant_video")
    private Boolean participantVideo = false;

    @Column(name = "join_before_host")
    private Boolean joinBeforeHost = false;

    @Column(name = "audio", length = 20)
    private String audio = "both";

    @Column(name = "auto_recording", length = 20)
    private String autoRecording = "none";

    @Column(name = "approval_type")
    private Integer approvalType = 0;

    @Column(name = "mute_upon_entry")
    private Boolean muteUponEntry = false;

    @Column(name = "waiting_room")
    private Boolean waitingRoom = false;

    @Column(name = "api_use_for")
    private Integer apiUseFor = 0;

    @Column(name = "api_key")
    private String apiKey;

    @Column(name = "secret_key")
    private String secretKey;
}
