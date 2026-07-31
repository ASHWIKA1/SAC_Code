package com.sac.erp.modules.canteen.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "sm_canteen_audit_logs")
public class CanteenAuditLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "old_balance", nullable = false)
    private BigDecimal oldBalance;

    @Column(name = "new_balance", nullable = false)
    private BigDecimal newBalance;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "pos_device_id")
    private String posDeviceId;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "reason_code", nullable = false)
    private String reasonCode; // e.g. RECHARGE, PURCHASE, REFUND

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
