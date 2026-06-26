package com.sac.erp.modules.canteen.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_suppliers")
public class CanteenSupplier extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "supplier_name", nullable = false)
    private String supplierName;

    @Column(name = "contact_person")
    private String contactPerson;

    private String phone;
    private String email;
    private String address;

    @Column(name = "supply_type")
    private String supplyType;

    @Column(name = "is_active", nullable = false)
    private Integer isActive = 1;

    @Column(name = "total_supplied", nullable = false)
    private BigDecimal totalSupplied = BigDecimal.ZERO;
    @Column(name = "school_id")
    private String schoolId;
}
