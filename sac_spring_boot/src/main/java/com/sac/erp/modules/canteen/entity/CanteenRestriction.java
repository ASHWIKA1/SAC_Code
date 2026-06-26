package com.sac.erp.modules.canteen.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_canteen_restrictions")
public class CanteenRestriction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "item_id")
    private Long itemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "restriction_type", columnDefinition = "ENUM('category_block','item_block','daily_limit','time_restriction')", nullable = false)
    private RestrictionType restrictionType;

    @Column(name = "restriction_value")
    private String restrictionValue;

    private String reason;

    @Column(name = "set_by")
    private Long setBy;

    @Column(name = "is_active", nullable = false)
    private Integer isActive = 1;
    @Column(name = "school_id")
    private String schoolId;

    public enum RestrictionType {
        category_block, item_block, daily_limit, time_restriction
    }
}
