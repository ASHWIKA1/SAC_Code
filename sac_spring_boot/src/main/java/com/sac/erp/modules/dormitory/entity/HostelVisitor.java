package com.sac.erp.modules.dormitory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_hostel_visitors")
public class HostelVisitor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "hostel_id")
    private Long hostelId;

    @Column(name = "visitor_name")
    private String visitorName;

    @Column(name = "visitor_phone")
    private String visitorPhone;

    @Column(name = "relationship")
    private String relationship;

    @Column(name = "id_proof_type")
    private String idProofType;

    @Column(name = "id_proof_number")
    private String idProofNumber;

    @Column(name = "check_in")
    private LocalDate checkIn;

    @Column(name = "check_out")
    private LocalDate checkOut;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "status")
    private String status;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "school_id")
    private String schoolId;
}
