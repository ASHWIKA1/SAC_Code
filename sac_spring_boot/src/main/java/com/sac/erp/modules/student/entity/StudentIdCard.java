package com.sac.erp.modules.student.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_student_id_cards")
public class StudentIdCard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "logo")
    private String logo;

    @Column(name = "signature")
    private String signature;

    @Column(name = "background_img")
    private String backgroundImg;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "page_layout_style")
    private String pageLayoutStyle;

    @Column(name = "user_photo_style")
    private String userPhotoStyle;

    @Column(name = "user_photo_width")
    private String userPhotoWidth;

    @Column(name = "user_photo_height")
    private String userPhotoHeight;

    @Column(name = "pl_width")
    private Integer plWidth;

    @Column(name = "pl_height")
    private Integer plHeight;

    @Column(name = "t_space")
    private Integer tSpace;

    @Column(name = "b_space")
    private Integer bSpace;

    @Column(name = "r_space")
    private Integer rSpace;

    @Column(name = "l_space")
    private Integer lSpace;

    @Column(name = "admission_no")
    private String admissionNo;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "class")
    private String classField;

    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "mother_name")
    private String motherName;

    @Column(name = "student_address")
    private String studentAddress;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "dob")
    private String dob;

    @Column(name = "blood")
    private String blood;

    @Column(name = "photo")
    private Integer photo;

    @Column(name = "signature_status")
    private Integer signatureStatus;

    @Column(name = "active_status")
    private Integer activeStatus;

    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "staff_department")
    private Integer staffDepartment;

    @Column(name = "staff_designation")
    private Integer staffDesignation;
}
