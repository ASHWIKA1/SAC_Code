package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_rooms")
public class HostelRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hostel_id")
    private Long hostelId;

    @Column(name = "room_no")
    private String roomNo;

    @Column(name = "room_type")
    private String roomType;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "fee_per_month")
    private Double feePerMonth;

    @Column(name = "amenities")
    private String amenities;

    @Column(name = "status")
    private String status;

    @Column(name = "school_id")
    private String schoolId;
}
