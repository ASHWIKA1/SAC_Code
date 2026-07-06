package com.sac.erp.modules.wallet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @org.hibernate.annotations.TenantId
    @Column(name = "school_id", nullable = false)
    private String schoolId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "bank_id")
    private Long bankId;

    @Column(precision = 10, scale = 2)
    private BigDecimal expense;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(length = 500)
    private String description;

    @Column(name = "transaction_type", length = 50)
    private String transactionType; // CREDIT, DEBIT

    @Column(length = 50)
    private String status; // PENDING, CONFIRMED, FAILED

    @Column(name = "reference_no", length = 100)
    private String referenceNo;

    @Column(name = "payment_gateway", length = 100)
    private String paymentGateway;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
