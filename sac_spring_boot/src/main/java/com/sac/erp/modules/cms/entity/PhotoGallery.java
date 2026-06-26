package com.sac.erp.modules.cms.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_photo_galleries")
public class PhotoGallery extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "feature_image")
    private String featureImage;

    @Column(name = "gallery_image")
    private String galleryImage;

    @Column(name = "is_publish")
    private Integer isPublish;

    @Column(name = "position")
    private Integer position;

    @Column(name = "school_id")
    private String schoolId;
}
