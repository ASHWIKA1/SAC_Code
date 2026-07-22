package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class VendorDocumentDto {
    private Long id;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotBlank(message = "Document type is required")
    private String documentType;

    private String documentNumber;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    private LocalDate issueDate;
    private LocalDate expiryDate;
    private Integer reminderBeforeExpiryDays;
    private String status;
    private String remarks;
}
