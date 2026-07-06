package com.sac.erp.modules.library.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_books")
public class Book extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_title")
    private String bookTitle;

    @Column(name = "book_number")
    private String bookNumber;

    @Column(name = "isbn_no")
    private String isbnNo;

    private String publisher;
    private String author;

    @Column(name = "quantity")
    private Integer quantity = 0;

    @Column(name = "book_price")
    private Double bookPrice = 0.0;

    @Column(name = "active_status")
    private Integer activeStatus = 1;
    @Column(name = "school_id")
    private String schoolId;
}
