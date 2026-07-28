package com.sac.erp.modules.vendor.controller;

import com.sac.erp.modules.vendor.dto.VendorPaymentDto;
import com.sac.erp.modules.vendor.entity.VendorPayment;
import com.sac.erp.modules.vendor.service.VendorPaymentService;
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
@RequestMapping("/api/v1/vendors/payments")
@RequiredArgsConstructor
public class VendorPaymentController {

    private final VendorPaymentService vendorPaymentService;

    @GetMapping
    public ResponseEntity<Page<VendorPayment>> getPayments(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorPaymentService.searchPayments(search, PageRequest.of(page, size, Sort.by("id").descending()), schoolId));
    }

    @PostMapping
    public ResponseEntity<VendorPayment> createPayment(@Valid @RequestBody VendorPaymentDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorPaymentService.createPayment(dto, schoolId, 1L));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorPayment> updatePayment(@PathVariable Long id, @Valid @RequestBody VendorPaymentDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorPaymentService.updatePayment(id, dto, schoolId, 1L));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<VendorPayment> verifyInvoice(@PathVariable Long id, @RequestParam String status) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorPaymentService.verifyInvoice(id, status, schoolId, 1L));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<VendorPayment> makePayment(@PathVariable Long id, @RequestParam String bankTransferDetails) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorPaymentService.makePayment(id, bankTransferDetails, schoolId, 1L));
    }

    @GetMapping("/all")
    public ResponseEntity<List<VendorPayment>> getAllPayments() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(vendorPaymentService.getPaymentsBySchool(schoolId));
    }
}
