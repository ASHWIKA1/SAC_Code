package com.sac.erp.modules.cms.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_news")
public class News extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "news_title")
    private String newsTitle;

    @Column(name = "news_body", columnDefinition = "TEXT")
    private String newsBody;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    private String image;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
