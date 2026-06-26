package com.sac.erp.modules.cms.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_news_pages")
public class NewsPage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "main_title")
    private String mainTitle;

    @Column(name = "main_description")
    private String mainDescription;

    @Column(name = "image")
    private String image;

    @Column(name = "main_image")
    private String mainImage;

    @Column(name = "button_text")
    private String buttonText;

    @Column(name = "button_url")
    private String buttonUrl;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "school_id")
    private String schoolId;
}
