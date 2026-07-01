package com.sac.erp.modules.behavior.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "behaviour_record_settings")
public class BehaviorSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_comment")
    private Integer studentComment;

    @Column(name = "parent_comment")
    private Integer parentComment;

    @Column(name = "student_view")
    private Integer studentView;

    @Column(name = "parent_view")
    private Integer parentView;

    @Column(name = "school_id")
    private String schoolId;
}
