package com.sac.erp.modules.exam.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "front_exam_routines")
public class FrontExamRoutine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "publish_date")
    private String publishDate;

    @Column(name = "result_file")
    private String resultFile;

    @Column(name = "school_id")
    private String schoolId;
}
