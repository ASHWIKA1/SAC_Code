package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class DeliveryTrackingDto {
    private Long id;

    @NotNull(message = "Purchase Order ID is required")
    private Long poId;

    private LocalDate expectedDate;
    private LocalDate dispatchDate;
    private String courierDetails;
    private String trackingNumber;
    private LocalDate receivedDate;
    private Integer pendingQuantity;
    private String deliveryStatus;
}
