package com.sac.erp.modules.attendance.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.entity.StudentRecord;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_student_attendances")
public class StudentAttendance extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attendance_type", length = 10)
    private String attendanceType; // P, L, A, H, F

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_record_id")
    private StudentRecord studentRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassRecord classRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;

    @com.fasterxml.jackson.annotation.JsonProperty("className")
    public String getClassName() {
        return classRecord != null ? classRecord.getClassName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("sectionName")
    public String getSectionName() {
        return section != null ? section.getSectionName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("date")
    public LocalDate getDate() {
        return attendanceDate;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("className")
    public void setClassName(String className) {}

    @com.fasterxml.jackson.annotation.JsonProperty("sectionName")
    public void setSectionName(String sectionName) {}

    @com.fasterxml.jackson.annotation.JsonProperty("date")
    public void setDate(LocalDate date) {
        this.attendanceDate = date;
    }
}
