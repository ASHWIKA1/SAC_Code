package com.sac.erp.modules.inventory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_item_sell_children")
public class ItemSellChild extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sell_price")
    private Double sellPrice;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "sub_total")
    private Double subTotal;

    @Column(name = "description")
    private String description;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "item_sell_id")
    private Long itemSellId;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
