package com.sac.erp.modules.jitsi.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "jitsi_virtual_classes")
public class JitsiVirtualClass extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id", columnDefinition = "TEXT")
    private String meetingId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "section_id")
    private String sectionId;

    @Column(name = "subject_id")
    private String subjectId;

    @Column(columnDefinition = "TEXT")
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "time_start_before", columnDefinition = "TEXT")
    private String timeStartBefore;

    @Column(nullable = false)
    private Integer duration = 0;

    @Column(columnDefinition = "TEXT")
    private String date;

    @Column(columnDefinition = "TEXT")
    private String time;

    @Column(columnDefinition = "TEXT")
    private String datetime;

    @Column(name = "attached_file", columnDefinition = "TEXT")
    private String attachedFile;
}
