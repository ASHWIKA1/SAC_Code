package com.sac.erp.modules.inventory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_items")
public class Item extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name")
    private String itemName;

    @Column(name = "item_category_id")
    private Long itemCategoryId;

    @Column(name = "item_store_id")
    private Long itemStoreId;

    private Integer total; // quantity available

    private String description;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
