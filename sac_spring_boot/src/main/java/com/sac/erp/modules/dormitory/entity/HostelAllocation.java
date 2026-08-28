package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_allocations")
public class HostelAllocation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "hostel_id", nullable = false)
    private Long hostelId;

    @Column(name = "bed_number", nullable = false)
    private Integer bedNumber = 1;

    @Column(name = "allocation_date", nullable = false)
    private LocalDate allocationDate;

    @Column(name = "vacate_date")
    private LocalDate vacateDate;

    @Column(name = "status", nullable = false)
    private String status = "Active";

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "school_id")
    private String schoolId;
}
