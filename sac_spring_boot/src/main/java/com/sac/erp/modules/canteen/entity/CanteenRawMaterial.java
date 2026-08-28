package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_raw_materials")
public class CanteenRawMaterial extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "material_name", nullable = false)
    private String materialName;

    @Column(name = "current_stock_quantity", nullable = false)
    private BigDecimal currentStockQuantity = BigDecimal.ZERO;

    @Column(name = "reorder_threshold", nullable = false)
    private BigDecimal reorderThreshold = BigDecimal.valueOf(5.0);

    @Column(nullable = false)
    private String unit = "kg";

    @Column(name = "school_id")
    private String schoolId;
}
