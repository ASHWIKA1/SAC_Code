package com.sac.erp.modules.canteen.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_items")
public class CanteenItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_code")
    private String itemCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CanteenCategory category;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "cost_price", nullable = false)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(nullable = false)
    private String unit = "piece";

    @Column(name = "is_available", nullable = false)
    private Integer isAvailable = 1;

    @Column(name = "is_vegetarian", nullable = false)
    private Integer isVegetarian = 1;

    private Integer calories;

    private String image;
    @Column(name = "school_id")
    private String schoolId;
}
