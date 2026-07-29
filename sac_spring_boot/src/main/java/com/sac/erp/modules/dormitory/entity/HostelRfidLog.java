package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_rfid_logs")
public class HostelRfidLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "hostel_id", nullable = false)
    private Long hostelId;

    @Column(name = "rfid_tag")
    private String rfidTag;

    @Column(name = "scan_timestamp", nullable = false)
    private LocalDateTime scanTimestamp;

    @Column(name = "gate_direction", nullable = false)
    private String gateDirection = "IN";

    @Column(name = "entry_status", nullable = false)
    private String entryStatus = "In-Bounds";

    @Column(name = "flagged", nullable = false)
    private Integer flagged = 0;

    @Column(name = "school_id")
    private String schoolId;
}
