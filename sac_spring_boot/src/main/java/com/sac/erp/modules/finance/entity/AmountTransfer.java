package com.sac.erp.modules.finance.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_amount_transfers")
public class AmountTransfer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "from_payment_method")
    private Integer fromPaymentMethod;

    @Column(name = "from_bank_name")
    private Integer fromBankName;

    @Column(name = "to_payment_method")
    private Integer toPaymentMethod;

    @Column(name = "to_bank_name")
    private Integer toBankName;

    @Column(name = "transfer_date")
    private LocalDate transferDate;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
