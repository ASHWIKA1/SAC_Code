package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_transactions")
public class CanteenTransaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private CanteenWallet wallet;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('purchase','recharge','refund','adjustment')", nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "balance_after", nullable = false)
    private BigDecimal balanceAfter;

    @Column(name = "item_id")
    private Long itemId;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "reference_no")
    private String referenceNo;

    @Column(name = "recharged_by")
    private String rechargedBy;

    private String notes;
    @Column(name = "school_id")
    private String schoolId;

    public enum TransactionType {
        purchase, recharge, refund, adjustment
    }
}
