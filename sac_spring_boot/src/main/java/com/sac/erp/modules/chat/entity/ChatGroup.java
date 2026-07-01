package com.sac.erp.modules.chat.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "chat_groups")
public class ChatGroup extends BaseEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    private Integer privacy;

    @Column(name = "read_only", nullable = false)
    private Boolean readOnly = false;

    @Column(name = "group_type", nullable = false)
    private Integer groupType = 1; // 1 => Open, 2 => Close

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "teacher_id")
    private Long teacherId;
    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "shift_id")
    private Integer shiftId;

    @PrePersist
    public void ensureId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}
