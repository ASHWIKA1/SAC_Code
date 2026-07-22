package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
public class PurchaseOrderDto {
    private Long id;
    private String poNumber;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotBlank(message = "Items list cannot be empty")
    private String items; // JSON block

    private Integer quantity;
    private BigDecimal rate;
    private BigDecimal gst;
    private BigDecimal discount;
    private LocalDate deliveryDate;
    private String paymentTerms;
    private String deliveryAddress;
    private String termsConditions;
    private String poStatus;
    private Integer revisionNumber;
}
