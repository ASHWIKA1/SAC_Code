package com.sac.erp.modules.finance.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_bank_statements")
public class BankStatement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bank_id")
    private Long bankId;

    @Column(name = "after_balance")
    private Integer afterBalance;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "type")
    private String type;

    @Column(name = "payment_method")
    private Integer paymentMethod;

    @Column(name = "details")
    private String details;

    @Column(name = "item_receive_id")
    private Long itemReceiveId;

    @Column(name = "item_receive_bank_statement_id")
    private Long itemReceiveBankStatementId;

    @Column(name = "item_sell_bank_statement_id")
    private Long itemSellBankStatementId;

    @Column(name = "item_sell_id")
    private Long itemSellId;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "fees_payment_id")
    private Long feesPaymentId;

    @Column(name = "payroll_payment_id")
    private Long payrollPaymentId;
}
