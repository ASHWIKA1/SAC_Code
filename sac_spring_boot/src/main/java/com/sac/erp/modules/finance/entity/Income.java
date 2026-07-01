package com.sac.erp.modules.finance.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_add_incomes")
public class Income extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double amount;
    private LocalDate date;

    @Column(name = "income_head_id")
    private Long incomeHeadId;

    @Column(name = "bank_account_id")
    private Long bankAccountId;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
