package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_recipe_boms")
public class CanteenRecipeBom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;

    @Column(name = "raw_material_id", nullable = false)
    private Long rawMaterialId;

    @Column(name = "required_quantity_per_unit", nullable = false)
    private BigDecimal requiredQuantityPerUnit = BigDecimal.ZERO;

    @Column(name = "unit_of_measure", nullable = false)
    private String unitOfMeasure = "kg";

    @Column(name = "school_id")
    private String schoolId;
}
