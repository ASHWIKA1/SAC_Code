package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoodsReceiptNoteDto {
    private Long id;
    private String grnNumber;

    @NotNull(message = "Purchase Order ID is required")
    private Long poId;

    private Integer receivedQuantity;
    private Integer acceptedQuantity;
    private Integer rejectedQuantity;
    private String inspectionRemarks;
    private Long storeLocationId;
    private String fileUrl;
}
