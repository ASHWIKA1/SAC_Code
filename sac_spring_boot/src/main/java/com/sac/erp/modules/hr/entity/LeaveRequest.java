package com.sac.erp.modules.hr.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import com.sac.erp.modules.core.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_leave_requests")
public class LeaveRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apply_date")
    private LocalDate applyDate;

    @Column(name = "leave_from")
    private LocalDate leaveFrom;

    @Column(name = "leave_to")
    private LocalDate leaveTo;

    @Column(name = "reason")
    private String reason;

    @Column(name = "note")
    private String note;

    private String file;

    @Column(name = "approve_status")
    private String approveStatus = "P"; // P = pending, A = approved, R = rejected

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_define_id")
    private LeaveDefine leaveDefine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private User staff; // Maps to User table via staff_id foreign key

    @Column(name = "role_id")
    private Long roleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private LeaveType leaveType;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
