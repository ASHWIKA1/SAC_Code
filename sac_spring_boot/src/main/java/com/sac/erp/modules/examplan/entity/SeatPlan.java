package com.sac.erp.modules.examplan.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "seat_plans")
public class SeatPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_record_id")
    private Long studentRecordId;

    @Column(name = "exam_type_id")
    private Long examTypeId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "room_no")
    private String roomNo;

    @Column(name = "seat_no")
    private String seatNo;

    @Column(name = "row_no")
    private Integer rowNo;

    @Column(name = "col_no")
    private Integer colNo;
    @Column(name = "school_id")
    private String schoolId;
}
