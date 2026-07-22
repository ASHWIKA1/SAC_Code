package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class VendorPerformanceDto {
    private Long id;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    private BigDecimal deliveryPerformance;
    private BigDecimal qualityRating;
    private BigDecimal communication;
    private BigDecimal responseTime;
    private BigDecimal pricing;
    private Integer complaintCount;
    private Integer rejectedMaterials;
    private BigDecimal compliance;
    private BigDecimal overallRating;
    private String ratingLevel;
    private Boolean blacklistRecommendation;
    private String feedback;
}
