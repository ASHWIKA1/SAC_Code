package com.sac.erp.modules.vendor.controller;

import com.sac.erp.modules.vendor.dto.*;
import com.sac.erp.modules.vendor.entity.*;
import com.sac.erp.modules.vendor.service.ProcurementService;
import com.sac.erp.tenant.TenantContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors/procurement")
@RequiredArgsConstructor
public class ProcurementController {

    private final ProcurementService procurementService;

    // Requests
    @GetMapping("/requests")
    public ResponseEntity<Page<PurchaseRequest>> getRequests(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.searchRequests(search, PageRequest.of(page, size, Sort.by("id").descending()), schoolId));
    }

    @PostMapping("/requests")
    public ResponseEntity<PurchaseRequest> createRequest(@Valid @RequestBody PurchaseRequestDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.createPurchaseRequest(dto, schoolId, 1L));
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<PurchaseRequest> updateRequest(@PathVariable Long id, @Valid @RequestBody PurchaseRequestDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.updatePurchaseRequest(id, dto, schoolId, 1L));
    }

    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<PurchaseRequest> approveRequest(@PathVariable Long id, @RequestParam String status) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.approveRequest(id, status, schoolId, 1L));
    }

    // Purchase Orders
    @GetMapping("/orders")
    public ResponseEntity<Page<PurchaseOrder>> getOrders(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.searchPurchaseOrders(search, PageRequest.of(page, size, Sort.by("id").descending()), schoolId));
    }

    @PostMapping("/orders")
    public ResponseEntity<PurchaseOrder> createOrder(@Valid @RequestBody PurchaseOrderDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.createPurchaseOrder(dto, schoolId, 1L));
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<PurchaseOrder> updateOrder(@PathVariable Long id, @Valid @RequestBody PurchaseOrderDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.updatePurchaseOrder(id, dto, schoolId, 1L));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<PurchaseOrder> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.updatePoStatus(id, status, schoolId, 1L));
    }

    // Delivery
    @PostMapping("/deliveries")
    public ResponseEntity<DeliveryTracking> logDelivery(@Valid @RequestBody DeliveryTrackingDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.logDelivery(dto, schoolId, 1L));
    }

    @GetMapping("/orders/{poId}/deliveries")
    public ResponseEntity<List<DeliveryTracking>> getDeliveries(@PathVariable Long poId) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.getDeliveriesByPo(poId, schoolId));
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryTracking>> getAllDeliveries() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.getAllDeliveries(schoolId));
    }

    // GRN
    @PostMapping("/grns")
    public ResponseEntity<GoodsReceiptNote> createGrn(@Valid @RequestBody GoodsReceiptNoteDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.createGrn(dto, schoolId, 1L));
    }

    @GetMapping("/grns")
    public ResponseEntity<List<GoodsReceiptNote>> getGrns() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(procurementService.getGrnsBySchool(schoolId));
    }
}
