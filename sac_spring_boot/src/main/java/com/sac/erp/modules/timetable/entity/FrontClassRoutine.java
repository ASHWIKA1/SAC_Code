package com.sac.erp.modules.timetable.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "front_class_routines")
public class FrontClassRoutine extends BaseEntity {

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
