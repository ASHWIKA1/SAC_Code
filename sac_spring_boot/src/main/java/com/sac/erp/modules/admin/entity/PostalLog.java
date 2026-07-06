package com.sac.erp.modules.admin.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_postal_receives")
public class PostalLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "to_title")
    private String toTitle;

    @Column(name = "from_title")
    private String fromTitle;

    @Column(name = "reference_no")
    private String referenceNo;

    private LocalDate date;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
