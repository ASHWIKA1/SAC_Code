package com.sac.erp.modules.behavior.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_student_behaviors")
public class StudentBehavior extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "behavior_type", columnDefinition = "ENUM('good','average','misbehavior')", nullable = false)
    private BehaviorType behaviorType = BehaviorType.good;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('discipline','attitude','conduct')", nullable = false)
    private BehaviorCategory category = BehaviorCategory.discipline;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "reported_by")
    private String reportedBy;

    @Column(name = "reported_date")
    private LocalDate reportedDate;
    @Column(name = "school_id")
    private String schoolId;

    public enum BehaviorType {
        good, average, misbehavior
    }

    public enum BehaviorCategory {
        discipline, attitude, conduct
    }
}
