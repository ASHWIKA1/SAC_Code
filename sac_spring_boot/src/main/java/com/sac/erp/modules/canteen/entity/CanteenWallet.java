package com.sac.erp.modules.canteen.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_wallets")
public class CanteenWallet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "rfid_card_uid")
    private String rfidCardUid;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "daily_limit")
    private BigDecimal dailyLimit;

    @Column(name = "is_active")
    private Integer isActive;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "school_id")
    private String schoolId;
}
