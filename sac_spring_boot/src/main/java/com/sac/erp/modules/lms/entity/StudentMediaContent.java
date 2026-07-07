package com.sac.erp.modules.lms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "student_media_content")
public class StudentMediaContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "media_content_id", nullable = false)
    private MediaContent mediaContent;

    @Column(name = "accessed_date", insertable = false, updatable = false)
    private LocalDateTime accessedDate;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
