package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_room_types")
public class HostelRoomType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false)
    private String typeName;

    @Column(name = "description")
    private String description;

    @Column(name = "base_fee", nullable = false)
    private BigDecimal baseFee = BigDecimal.ZERO;

    @Column(name = "max_occupants", nullable = false)
    private Integer maxOccupants = 1;

    @Column(name = "school_id")
    private String schoolId;
}
