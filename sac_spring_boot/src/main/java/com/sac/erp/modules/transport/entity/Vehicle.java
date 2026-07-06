package com.sac.erp.modules.transport.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_vehicles")
public class Vehicle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_no")
    private String vehicleNo;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    @Column(name = "made_year")
    private String madeYear;

    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "driver_license")
    private String driverLicense;

    @Column(name = "driver_contact")
    private String driverContact;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
