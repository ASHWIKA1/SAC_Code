package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_room_lists")
public class RoomList extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_no")
    private String roomNo;

    @Column(name = "number_of_bed")
    private Integer numberOfBed;

    @Column(name = "cost_per_bed")
    private Double costPerBed;

    @Column(name = "dormitory_id")
    private Long dormitoryId;

    @Column(name = "room_type_id")
    private Long roomTypeId;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
