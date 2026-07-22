package com.sac.erp.modules.vendor.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class VendorDashboardDto {
    private long totalVendors;
    private long activeVendors;
    private long pendingVendors;
    private long expiredAgreements;
    private long expiringNdas;
    private long expiringMous;
    private long pendingPos;
    private long pendingGrns;
    private long pendingPayments;

    // Charts & Summary
    private Map<String, Long> ratingSummary;
    private List<Map<String, Object>> vendorGrowth;
    private List<Map<String, Object>> monthlyProcurement;
    private List<Map<String, Object>> departmentWisePurchase;
    private List<Map<String, Object>> vendorPerformanceList;
    private List<Map<String, Object>> topVendors;
    private List<Map<String, Object>> delayedDeliveries;
}
