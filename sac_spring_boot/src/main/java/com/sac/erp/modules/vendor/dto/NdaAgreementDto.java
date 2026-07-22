package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class NdaAgreementDto {
    private Long id;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotBlank(message = "NDA Number is required")
    private String ndaNumber;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private Long departmentId;
    private String confidentialityLevel;
    private String fileUrl;
    private String status;
}
