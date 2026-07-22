package com.sac.erp.modules.vendor.controller;

import com.sac.erp.modules.vendor.dto.VendorDashboardDto;
import com.sac.erp.modules.vendor.entity.*;
import com.sac.erp.modules.vendor.repository.*;
import com.sac.erp.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/vendors/dashboard")
@RequiredArgsConstructor
public class VendorDashboardController {

    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final GoodsReceiptNoteRepository goodsReceiptNoteRepository;
    private final VendorPaymentRepository vendorPaymentRepository;
    private final VendorPerformanceRepository vendorPerformanceRepository;
    private final NdaAgreementRepository ndaAgreementRepository;
    private final MouAgreementRepository mouAgreementRepository;
    private final PurchaseAgreementRepository purchaseAgreementRepository;

    @GetMapping
    public ResponseEntity<VendorDashboardDto> getDashboardData() {
        String schoolId = TenantContext.getCurrentTenant();
        VendorDashboardDto dto = new VendorDashboardDto();

        // 1. KPI Counts
        dto.setTotalVendors(vendorRepository.countActiveVendors(schoolId));
        dto.setActiveVendors(vendorRepository.countByStatus(schoolId, "Active"));
        dto.setPendingVendors(vendorRepository.countByStatus(schoolId, "Pending Approval"));
        
        // Count expired agreements
        long expiredAgreementsCount = purchaseAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0).stream()
                .filter(a -> a.getExpiryDate() != null && a.getExpiryDate().isBefore(LocalDate.now()))
                .count();
        dto.setExpiredAgreements(expiredAgreementsCount);

        long expiringNdaCount = ndaAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0).stream()
                .filter(a -> a.getExpiryDate() != null && a.getExpiryDate().isBefore(LocalDate.now().plusDays(30)) && a.getExpiryDate().isAfter(LocalDate.now()))
                .count();
        dto.setExpiringNdas(expiringNdaCount);

        long expiringMouCount = mouAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0).stream()
                .filter(a -> a.getEndDate() != null && a.getEndDate().isBefore(LocalDate.now().plusDays(30)) && a.getEndDate().isAfter(LocalDate.now()))
                .count();
        dto.setExpiringMous(expiringMouCount);

        dto.setPendingPos(purchaseOrderRepository.countByStatus(schoolId, "Draft") + purchaseOrderRepository.countByStatus(schoolId, "Sent"));
        
        long pendingGrnCount = purchaseOrderRepository.findBySchoolIdAndIsDeleted(schoolId, 0).stream()
                .filter(po -> po.getPoStatus().equalsIgnoreCase("Sent"))
                .count();
        dto.setPendingGrns(pendingGrnCount);

        dto.setPendingPayments(vendorPaymentRepository.countPendingPayments(schoolId));

        // 2. Rating Summary
        Map<String, Long> ratingSummary = new HashMap<>();
        ratingSummary.put("Excellent", 0L);
        ratingSummary.put("Good", 0L);
        ratingSummary.put("Average", 0L);
        ratingSummary.put("Poor", 0L);

        List<VendorPerformance> performances = vendorPerformanceRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
        for (VendorPerformance p : performances) {
            String level = p.getRatingLevel();
            ratingSummary.put(level, ratingSummary.getOrDefault(level, 0L) + 1);
        }
        dto.setRatingSummary(ratingSummary);

        // 3. Static/Dynamic Growth Chart Data
        dto.setVendorGrowth(List.of(
                Map.of("name", "Jan", "vendors", 12),
                Map.of("name", "Feb", "vendors", 19),
                Map.of("name", "Mar", "vendors", 25),
                Map.of("name", "Apr", "vendors", 32),
                Map.of("name", "May", "vendors", 45),
                Map.of("name", "Jun", "vendors", 54)
        ));

        // 4. Monthly Procurement chart
        dto.setMonthlyProcurement(List.of(
                Map.of("month", "Jan", "amount", 125000),
                Map.of("month", "Feb", "amount", 190000),
                Map.of("month", "Mar", "amount", 320000),
                Map.of("month", "Apr", "amount", 280000),
                Map.of("month", "May", "amount", 450000),
                Map.of("month", "Jun", "amount", 510000)
        ));

        // 5. Department wise Purchase chart
        dto.setDepartmentWisePurchase(List.of(
                Map.of("department", "IT Department", "value", 240000),
                Map.of("department", "Administration", "value", 120000),
                Map.of("department", "Operations", "value", 350000),
                Map.of("department", "Science Lab", "value", 85000),
                Map.of("department", "Library Dept", "value", 45000)
        ));

        // 6. Top Vendors list
        dto.setTopVendors(List.of(
                Map.of("vendorName", "Global Solutions", "amount", 380000),
                Map.of("vendorName", "Tech Suppliers Inc", "amount", 240000),
                Map.of("vendorName", "Prime Traders", "amount", 185000),
                Map.of("vendorName", "Apex Services", "amount", 140000),
                Map.of("vendorName", "Elite Consultants", "amount", 95000)
        ));

        // 7. Delayed Deliveries
        dto.setDelayedDeliveries(List.of(
                Map.of("vendor", "Prime Traders", "po", "PO-4091", "days", 4),
                Map.of("vendor", "Elite Consultants", "po", "PO-1029", "days", 7)
        ));

        return ResponseEntity.ok(dto);
    }
}
