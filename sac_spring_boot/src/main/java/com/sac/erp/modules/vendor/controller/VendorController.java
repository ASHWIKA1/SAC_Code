package com.sac.erp.modules.vendor.controller;

import com.sac.erp.modules.vendor.dto.*;
import com.sac.erp.modules.vendor.entity.*;
import com.sac.erp.modules.vendor.service.VendorService;
import com.sac.erp.tenant.TenantContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public ResponseEntity<Page<Vendor>> getVendors(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("REST request to list vendors (search: {})", search);
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return ResponseEntity.ok(vendorService.searchVendors(search, PageRequest.of(page, size, sort), schoolId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendor(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("REST request to get vendor ID: {}", id);
        return ResponseEntity.ok(vendorService.getVendorById(id, schoolId));
    }

    @PostMapping
    public ResponseEntity<Vendor> createVendor(@Valid @RequestBody VendorDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("REST request to create vendor: {}", dto.getVendorName());
        return ResponseEntity.ok(vendorService.createVendor(dto, schoolId, 1L));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @Valid @RequestBody VendorDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("REST request to update vendor: {}", id);
        return ResponseEntity.ok(vendorService.updateVendor(id, dto, schoolId, 1L));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVendor(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("REST request to delete vendor: {}", id);
        vendorService.deleteVendor(id, schoolId, 1L);
        return ResponseEntity.ok(Map.of("message", "Vendor deleted successfully"));
    }

    // Documents
    @PostMapping("/documents")
    public ResponseEntity<VendorDocument> uploadDoc(@Valid @RequestBody VendorDocumentDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.uploadDocument(dto, schoolId, 1L));
    }

    @GetMapping("/{vendorId}/documents")
    public ResponseEntity<List<VendorDocument>> getVendorDocs(@PathVariable Long vendorId) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getDocumentsByVendor(vendorId, schoolId));
    }

    @PutMapping("/documents/{id}/verify")
    public ResponseEntity<VendorDocument> verifyDoc(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String remarks) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.verifyDocument(id, status, remarks, schoolId, "Admin"));
    }

    @GetMapping("/documents/expired")
    public ResponseEntity<List<VendorDocument>> getExpiredDocs() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getExpiredDocuments(schoolId));
    }

    // NDA
    @PostMapping("/ndas")
    public ResponseEntity<NdaAgreement> createNda(@Valid @RequestBody NdaAgreementDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.createNda(dto, schoolId, 1L));
    }

    @GetMapping("/{vendorId}/ndas")
    public ResponseEntity<List<NdaAgreement>> getVendorNdas(@PathVariable Long vendorId) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getNdasByVendor(vendorId, schoolId));
    }

    @GetMapping("/ndas/active")
    public ResponseEntity<List<NdaAgreement>> getActiveNdas() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getActiveNdas(schoolId));
    }

    // MOU
    @PostMapping("/mous")
    public ResponseEntity<MouAgreement> createMou(@Valid @RequestBody MouAgreementDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.createMou(dto, schoolId, 1L));
    }

    @GetMapping("/{vendorId}/mous")
    public ResponseEntity<List<MouAgreement>> getVendorMous(@PathVariable Long vendorId) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getMousByVendor(vendorId, schoolId));
    }

    @PutMapping("/mous/{id}/approve")
    public ResponseEntity<MouAgreement> approveMou(@PathVariable Long id, @RequestParam String status) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.approveMou(id, status, schoolId, 1L));
    }

    @GetMapping("/mous/active")
    public ResponseEntity<List<MouAgreement>> getActiveMous() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getActiveMous(schoolId));
    }

    // Agreements
    @PostMapping("/agreements")
    public ResponseEntity<PurchaseAgreement> createAgreement(@Valid @RequestBody PurchaseAgreementDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.createAgreement(dto, schoolId, 1L));
    }

    @GetMapping("/{vendorId}/agreements")
    public ResponseEntity<List<PurchaseAgreement>> getVendorAgreements(@PathVariable Long vendorId) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getAgreementsByVendor(vendorId, schoolId));
    }

    @PutMapping("/agreements/{id}/approve")
    public ResponseEntity<PurchaseAgreement> approveAgreement(@PathVariable Long id, @RequestParam String status) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.approveAgreement(id, status, schoolId, 1L));
    }

    @GetMapping("/agreements/active")
    public ResponseEntity<List<PurchaseAgreement>> getActiveAgreements() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getActiveAgreements(schoolId));
    }

    // Performance
    @PostMapping("/performance")
    public ResponseEntity<VendorPerformance> savePerformance(@Valid @RequestBody VendorPerformanceDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.savePerformance(dto, schoolId, 1L));
    }

    @GetMapping("/{vendorId}/performance")
    public ResponseEntity<VendorPerformance> getVendorPerformance(@PathVariable Long vendorId) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getPerformanceByVendor(vendorId, schoolId));
    }

    @GetMapping("/performance/all")
    public ResponseEntity<List<VendorPerformance>> getPerformances() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorService.getAllPerformances(schoolId));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<VendorAuditLog>> getAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        String schoolId = TenantContext.getCurrentTenant();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return ResponseEntity.ok(vendorService.getAuditLogs(search, PageRequest.of(page, size, sort), schoolId));
    }
}
