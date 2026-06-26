package com.sac.erp.modules.canteen.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_inventory")
public class CanteenInventory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private CanteenItem item;

    @Column(name = "stock_quantity", nullable = false)
    private BigDecimal stockQuantity = BigDecimal.ZERO;

    @Column(name = "min_stock_level", nullable = false)
    private BigDecimal minStockLevel = new BigDecimal("10.00");

    @Column(nullable = false)
    private String unit = "units";

    @Column(name = "last_restocked")
    private LocalDate lastRestocked;

    @Column(name = "last_restock_qty", nullable = false)
    private BigDecimal lastRestockQty = BigDecimal.ZERO;

    @Column(name = "last_restock_cost", nullable = false)
    private BigDecimal lastRestockCost = BigDecimal.ZERO;
    @Column(name = "school_id")
    private String schoolId;
}
