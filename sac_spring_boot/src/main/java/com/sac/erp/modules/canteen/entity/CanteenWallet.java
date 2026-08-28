package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_wallets", indexes = {@Index(name = "idx_rfid_card_uid", columnList = "rfid_card_uid")})
public class CanteenWallet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "rfid_card_uid")
    private String rfidCardUid;

    @Column(name = "anonymized_token")
    private String anonymizedToken;

    @Column(name = "balance")
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "daily_limit")
    private BigDecimal dailyLimit = BigDecimal.valueOf(100.0);

    @Column(name = "todays_spent_amount")
    private BigDecimal todaysSpentAmount = BigDecimal.ZERO;

    @Column(name = "blocked_categories")
    private String blockedCategories; // Comma separated list of category names

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    @Column(name = "is_active")
    private Integer isActive = 1;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "school_id")
    private String schoolId;
}
