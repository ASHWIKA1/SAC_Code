package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_discipline_logs")
public class HostelDisciplineLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "class_name")
    private String className;

    @Column(name = "section")
    private String section;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "room_no")
    private String roomNo;

    @Column(name = "hostel_id", nullable = false)
    private Long hostelId;

    @Column(name = "incident_type", nullable = false)
    private String incidentType;

    @Column(name = "severity", nullable = false)
    private String severity = "Low";

    @Column(name = "description")
    private String description;

    @Column(name = "action_taken")
    private String actionTaken;

    @Column(name = "reported_by")
    private String reportedBy;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "status", nullable = false)
    private String status = "Under Review";

    @Column(name = "school_id")
    private String schoolId;
}
