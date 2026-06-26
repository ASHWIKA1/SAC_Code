package com.sac.erp.modules.student.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_student_placement_profiles")
public class StudentPlacementProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "skills")
    private String skills;

    @Column(name = "certifications")
    private String certifications;

    @Column(name = "resume_path")
    private String resumePath;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "is_opted_in")
    private Integer isOptedIn;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "school_id")
    private String schoolId;
}
