package com.sac.erp.modules.exam.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.entity.Subject;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.entity.StudentRecord;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_mark_stores")
public class MarkStore extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_roll_no")
    private Integer studentRollNo;

    @Column(name = "student_addmission_no")
    private Integer studentAdmissionNo;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks = 0.0;

    @Column(name = "is_absent", nullable = false)
    private Integer isAbsent = 0; // 0 = present, 1 = absent

    @Column(name = "teacher_remarks")
    private String teacherRemarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_term_id")
    private ExamType examTerm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_setup_id")
    private ExamSetup examSetup;

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

    @com.fasterxml.jackson.annotation.JsonProperty("studentName")
    public String getStudentName() {
        return student != null ? student.getFullName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("subjectName")
    public String getSubjectName() {
        return subject != null ? subject.getSubjectName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("marks")
    public Double getMarks() {
        return totalMarks;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("studentName")
    public void setStudentName(String studentName) {}

    @com.fasterxml.jackson.annotation.JsonProperty("subjectName")
    public void setSubjectName(String subjectName) {}

    @com.fasterxml.jackson.annotation.JsonProperty("marks")
    public void setMarks(Double marks) {
        this.totalMarks = marks;
    }
}
