package com.sac.erp.modules.inventory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_item_receives")
public class ItemReceive extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receive_date")
    private LocalDate receiveDate;

    @Column(name = "reference_no")
    private String referenceNo;

    @Column(name = "grand_total")
    private Double grandTotal;

    @Column(name = "total_quantity")
    private Double totalQuantity;

    @Column(name = "total_paid")
    private Double totalPaid;

    @Column(name = "total_due")
    private Double totalDue;

    @Column(name = "expense_head_id")
    private Long expenseHeadId;

    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "paid_status")
    private String paidStatus;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "store_id")
    private Long storeId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
