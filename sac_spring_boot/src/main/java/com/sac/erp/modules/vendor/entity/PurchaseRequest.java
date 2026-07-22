package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_purchase_requests")
public class PurchaseRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_number", nullable = false, unique = true)
    private String requestNumber;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "requested_by_id", nullable = false)
    private Long requestedById;

    private String priority = "Medium"; // Low, Medium, High, Urgent

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String items; // JSON serialized string of items list

    private Integer quantity = 0;

    @Column(name = "estimated_cost")
    private BigDecimal estimatedCost = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "approval_status")
    private String approvalStatus = "Pending"; // Pending, Approved, Rejected

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
