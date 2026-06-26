package com.sac.erp.modules.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "transcations")
public class Transcation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(nullable = false, length = 20)
    private String type = "debit";

    @Column(name = "payment_method", length = 20)
    private String paymentMethod;

    @Column(length = 20)
    private String reference;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "morphable_id")
    private Long morphableId;

    @Column(name = "morphable_type")
    private String morphableType;

    @Column(nullable = false)
    private Long amount = 0L;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "user_id")
    private Long userId;
    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
