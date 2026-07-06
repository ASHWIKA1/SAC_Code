package com.sac.erp.modules.inventory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_item_receive_children")
public class ItemReceiveChild extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "sub_total")
    private Double subTotal;

    @Column(name = "description")
    private String description;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "item_receive_id")
    private Long itemReceiveId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
