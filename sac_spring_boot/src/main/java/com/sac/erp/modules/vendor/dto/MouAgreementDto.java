package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
public class MouAgreementDto {
    private Long id;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotBlank(message = "MOU Number is required")
    private String mouNumber;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Long departmentId;
    private BigDecimal contractValue;
    private String fileUrl;
    private String approvalStatus;
}
