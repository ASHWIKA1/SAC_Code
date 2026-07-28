package com.sac.erp.modules.student.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_student_groups")
public class StudentGroup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonProperty("name")
    @Column(name = "`group`", nullable = false) // Note backticks because group is a reserved keyword in MySQL
    private String groupName;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
