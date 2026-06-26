package com.sac.erp.modules.attendance.entity;

import com.sac.erp.entity.BaseEntity;
import com.sac.erp.modules.hr.entity.Staff;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_staff_attendences")
public class StaffAttendance extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attendence_type", length = 10)
    private String attendanceType; // P, L, A, H, F (Note: 'e' spelling matched to DB dump)

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "attendence_date")
    private LocalDate attendanceDate; // Note: 'e' spelling matched to DB dump

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(name = "academic_id")
    private Long academicId;
    @Column(name = "school_id")
    private String schoolId;
}
