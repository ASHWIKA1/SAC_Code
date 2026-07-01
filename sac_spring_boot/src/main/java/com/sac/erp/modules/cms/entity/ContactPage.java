package com.sac.erp.modules.cms.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_contact_pages")
public class ContactPage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    @Column(name = "button_text")
    private String buttonText;

    @Column(name = "button_url")
    private String buttonUrl;

    @Column(name = "address")
    private String address;

    @Column(name = "address_text")
    private String addressText;

    @Column(name = "phone")
    private String phone;

    @Column(name = "phone_text")
    private String phoneText;

    @Column(name = "email")
    private String email;

    @Column(name = "email_text")
    private String emailText;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "zoom_level")
    private Integer zoomLevel;

    @Column(name = "google_map_address")
    private String googleMapAddress;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "school_id")
    private String schoolId;
}
