package com.sac.erp.modules.library.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_book_issues")
public class GeneralBookIssue extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "given_date")
    private LocalDate givenDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "issue_status")
    private String issueStatus;

    @Column(name = "note")
    private String note;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
