package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

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

    @Column(name = "sku")
    private String sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CanteenCategory category;

    @Column(name = "category_ids")
    private String categoryIds;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "cost_price", nullable = false)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "tax_rate")
    private BigDecimal taxRate = BigDecimal.ZERO;

    @Column(nullable = false)
    private String unit = "piece";

    @Column(name = "is_available", nullable = false)
    private Integer isAvailable = 1;

    @Column(name = "is_vegetarian", nullable = false)
    private Integer isVegetarian = 1;

    private Integer calories;

    private String image;

    @Column(name = "dietary_tags")
    private String dietaryTags; // e.g. Veg, Non-Veg, Gluten-Free

    @Column(name = "is_unlimited")
    private Boolean isUnlimited = false;

    @Column(name = "stock_quantity")
    private BigDecimal stockQuantity = BigDecimal.ZERO;

    @Column(name = "low_stock_threshold")
    private BigDecimal lowStockThreshold = BigDecimal.valueOf(10.0);

    @Column(name = "is_out_of_stock")
    private Boolean isOutOfStock = false;

    @Column(name = "school_id")
    private String schoolId;
}
