package com.sac.erp.modules.library.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_library_members")
public class LibraryMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_unique_id")
    private String memberUniqueId; // Card ID

    @Column(name = "student_staff_id")
    private Long studentStaffId; // references student_id or user_id

    @Column(name = "member_type")
    private String memberType; // student or staff

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
