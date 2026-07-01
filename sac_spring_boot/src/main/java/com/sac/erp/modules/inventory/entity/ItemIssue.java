package com.sac.erp.modules.inventory.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sm_item_issues")
public class ItemIssue extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "issue_to")
    private Long issueTo; // user_id

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "issue_status")
    private String issueStatus = "I"; // I = issued, R = returned

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
