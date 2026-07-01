package com.sac.erp.modules.hr.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_leave_defines")
public class LeaveDefine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer days;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private LeaveType leaveType;

    @Column(name = "total_days")
    private Integer totalDays = 0;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
