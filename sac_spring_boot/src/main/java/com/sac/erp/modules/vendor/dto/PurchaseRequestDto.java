package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
public class PurchaseRequestDto {
    private Long id;
    private String requestNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Requested by ID is required")
    private Long requestedById;

    private String priority;
    private LocalDate requiredDate;

    @NotBlank(message = "Items list cannot be empty")
    private String items; // JSON block

    private Integer quantity;
    private BigDecimal estimatedCost;
    private String justification;
    private String approvalStatus;
}
