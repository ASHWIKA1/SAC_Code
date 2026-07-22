package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sm_vendors")
public class Vendor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vendor_code", nullable = false, unique = true)
    private String vendorCode;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @Column(name = "vendor_type", nullable = false)
    private String vendorType; // Supplier, Service Provider, Consultant, Contractor

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "tan_number")
    private String tanNumber;

    @Column(name = "msme_status")
    private String msmeStatus = "No"; // Yes, No

    @Column(name = "msme_registration_number")
    private String msmeRegistrationNumber;

    @Column(name = "udyam_number")
    private String udyamNumber;

    @Column(name = "cin_number")
    private String cinNumber;

    @Column(name = "iec_number")
    private String iecNumber;

    @Column(name = "vendor_category")
    private String vendorCategory;

    @Column(name = "industry_type")
    private String industryType;

    @Column(name = "business_nature")
    private String businessNature;

    @Column(name = "establishment_year")
    private Integer establishmentYear;

    private String website;

    @Column(name = "contact_person")
    private String contactPerson;

    private String mobile;

    @Column(name = "alternate_mobile")
    private String alternateMobile;

    private String email;

    @Column(name = "alternate_email")
    private String alternateEmail;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    private String country;
    private String state;
    private String district;
    private String city;
    private String pincode;

    @Column(name = "account_holder")
    private String accountHolder;

    @Column(name = "account_number")
    private String accountNumber;

    private String ifsc;

    @Column(name = "bank_name")
    private String bankName;

    private String branch;

    private String status = "Pending Approval"; // Active, Inactive, Blacklisted, Pending Approval

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
