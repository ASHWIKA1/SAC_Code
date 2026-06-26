package com.sac.erp.modules.fees.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_applied_coupons")
public class AppliedCoupon extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "coupon_id")
    private Long couponId;

    @Column(name = "discount_amount")
    private Double discountAmount;
}
