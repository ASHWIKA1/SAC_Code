package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_mess_plans")
public class HostelMessPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hostel_id", nullable = false)
    private Long hostelId;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "breakfast")
    private String breakfast;

    @Column(name = "lunch")
    private String lunch;

    @Column(name = "dinner")
    private String dinner;

    @Column(name = "snacks")
    private String snacks;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "school_id")
    private String schoolId;
}
