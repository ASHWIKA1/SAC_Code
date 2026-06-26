package com.sac.erp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "languages")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "native", nullable = false)
    private String nativeName; // maps to `native` column in DB

    @Column(nullable = false)
    private Integer rtl = 0;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 0;
    @Column(name = "school_id")
    private String schoolId;
}
