package com.sac.erp.modules.zoom.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "zoom_meetings")
public class ZoomMeeting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id")
    private String meetingId;

    @Column(name = "password")
    private String password;

    @Column(columnDefinition = "TEXT")
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_of_meeting")
    private String dateOfMeeting;

    @Column(name = "time_of_meeting")
    private String timeOfMeeting;

    @Column(name = "meeting_duration")
    private String meetingDuration;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "time_before_start")
    private Integer timeBeforeStart;

    // Meeting settings
    @Column(name = "join_before_host")
    private Boolean joinBeforeHost = false;

    @Column(name = "host_video")
    private Boolean hostVideo = false;

    @Column(name = "participant_video")
    private Boolean participantVideo = false;

    @Column(name = "mute_upon_entry")
    private Boolean muteUponEntry = false;

    @Column(name = "waiting_room")
    private Boolean waitingRoom = false;

    @Column(name = "audio", length = 20)
    private String audio = "both";

    @Column(name = "auto_recording", length = 20)
    private String autoRecording = "none";

    @Column(name = "approval_type")
    private Integer approvalType = 0;

    // Recurring meeting fields
    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Column(name = "recurring_type")
    private Integer recurringType;

    @Column(name = "recurring_repect_day")
    private Integer recurringRepeatDay;

    @Column(name = "weekly_days")
    private String weeklyDays;

    @Column(name = "recurring_end_date")
    private String recurringEndDate;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "status")
    private Integer status = 1;

    @Column(name = "local_video", columnDefinition = "TEXT")
    private String localVideo;

    @Column(name = "video_link", columnDefinition = "TEXT")
    private String videoLink;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
