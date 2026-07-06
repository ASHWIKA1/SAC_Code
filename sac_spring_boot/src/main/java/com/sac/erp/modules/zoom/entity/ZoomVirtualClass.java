package com.sac.erp.modules.zoom.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "zoom_virtual_class")
public class ZoomVirtualClass extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id")
    private String meetingId;

    @Column(name = "password")
    private String password;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(columnDefinition = "TEXT")
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "attached_file", columnDefinition = "TEXT")
    private String attachedFile;

    @Column(name = "date_of_meeting")
    private String dateOfMeeting;

    @Column(name = "time_of_meeting")
    private String timeOfMeeting;

    @Column(name = "meeting_duration")
    private String meetingDuration;

    @Column(name = "time_before_start")
    private Integer timeBeforeStart;

    @Column(name = "join_before_host")
    private Boolean joinBeforeHost;

    @Column(name = "host_video")
    private Boolean hostVideo;

    @Column(name = "participant_video")
    private Boolean participantVideo;

    @Column(name = "mute_upon_entry")
    private Boolean muteUponEntry;

    @Column(name = "waiting_room")
    private Boolean waitingRoom;

    @Column(name = "audio", length = 20)
    private String audio = "both";

    @Column(name = "auto_recording", length = 20)
    private String autoRecording = "none";

    @Column(name = "approval_type", length = 10)
    private String approvalType = "0";

    @Column(name = "is_recurring")
    private Boolean isRecurring;

    @Column(name = "recurring_type")
    private Integer recurringType;

    @Column(name = "recurring_repect_day")
    private Integer recurringRepeatDay;

    @Column(name = "weekly_days")
    private String weeklyDays;

    @Column(name = "recurring_end_date")
    private String recurringEndDate;

    @Column(name = "status")
    private Integer status = 1;

    @Column(name = "local_video", columnDefinition = "TEXT")
    private String localVideo;

    @Column(name = "vedio_link", columnDefinition = "TEXT")
    private String videoLink;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
