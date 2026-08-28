package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorDto {
    private Long id;

    @NotBlank(message = "Vendor name is required")
    private String vendorName;

    @NotBlank(message = "Vendor type is required")
    private String vendorType; // Supplier, Service Provider, Consultant, Contractor

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String gstNumber;
    private String panNumber;
    private String tanNumber;
    private String msmeStatus;
    private String msmeRegistrationNumber;
    private String udyamNumber;
    private String cinNumber;
    private String iecNumber;
    private String vendorCategory;
    private String industryType;
    private String businessNature;
    private Integer establishmentYear;
    private String website;

    @NotBlank(message = "Contact person is required")
    private String contactPerson;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    private String alternateMobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    private String alternateEmail;

    private String billingAddress;
    private String shippingAddress;
    private String country;
    private String state;
    private String district;
    private String city;
    private String pincode;

    private String accountHolder;
    private String accountNumber;
    private String ifsc;
    private String bankName;
    private String branch;
    private String status;
}
