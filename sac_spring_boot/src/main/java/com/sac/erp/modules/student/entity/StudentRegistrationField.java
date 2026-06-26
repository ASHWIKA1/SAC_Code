package com.sac.erp.modules.student.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_student_registration_fields")
public class StudentRegistrationField extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "label_name")
    private String labelName;

    @Column(name = "is_show")
    private Integer isShow;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "is_required")
    private Integer isRequired;

    @Column(name = "student_edit")
    private Integer studentEdit;

    @Column(name = "parent_edit")
    private Integer parentEdit;

    @Column(name = "staff_edit")
    private Integer staffEdit;

    @Column(name = "type")
    private Integer type;

    @Column(name = "is_system_required")
    private Integer isSystemRequired;

    @Column(name = "required_type")
    private Integer requiredType;

    @Column(name = "position")
    private Integer position;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "admin_section")
    private String adminSection;
}
