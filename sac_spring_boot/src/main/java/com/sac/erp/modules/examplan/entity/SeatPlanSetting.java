package com.sac.erp.modules.examplan.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "seat_plan_settings")
public class SeatPlanSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "rows_per_room")
    private Integer rowsPerRoom = 5;

    @Column(name = "cols_per_room")
    private Integer colsPerRoom = 5;
    @Column(name = "school_id")
    private String schoolId;
}
