package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_hostels")
public class Hostel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hostel_name")
    private String hostelName;

    @Column(name = "type")
    private String type;

    @Column(name = "address")
    private String address;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "warden_name")
    private String wardenName;

    @Column(name = "warden_phone")
    private String wardenPhone;

    @Column(name = "warden_email")
    private String wardenEmail;

    @Column(name = "rfid_enabled")
    private Integer rfidEnabled;

    @Column(name = "rfid_reader_id")
    private Long rfidReaderId;

    @Column(name = "facilities")
    private String facilities;

    @Column(name = "status")
    private String status;

    @Column(name = "school_id")
    private String schoolId;
}
