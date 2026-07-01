package com.sac.erp.modules.finance.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_chart_of_accounts")
public class ChartOfAccount extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String head;
    private String type; // income (I) or expense (E)

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
