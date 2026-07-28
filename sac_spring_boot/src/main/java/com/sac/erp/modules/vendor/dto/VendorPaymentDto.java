package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class VendorPaymentDto {
    private Long id;

    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    private Long poId;
    private String fileUrl;
    private BigDecimal taxAmount;
    private BigDecimal tdsAmount;
    private BigDecimal gstAmount;
    private BigDecimal invoiceAmount;
    private String paymentRequestStatus;
    private String paymentStatus;
    private String bankTransferDetails;
    private BigDecimal outstandingBalance;
}
