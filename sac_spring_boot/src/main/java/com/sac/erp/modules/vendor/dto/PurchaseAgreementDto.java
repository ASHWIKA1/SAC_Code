package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
public class PurchaseAgreementDto {
    private Long id;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotBlank(message = "Agreement number is required")
    private String agreementNumber;

    @NotBlank(message = "Agreement type is required")
    private String agreementType; // Purchase Agreement, Service Agreement, AMC Agreement, etc.

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private BigDecimal contractValue;
    private LocalDate renewalDate;
    private String penaltyClause;
    private String termsConditions;
    private String approvalStatus;
    private String fileUrl;
}
