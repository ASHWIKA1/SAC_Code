package com.sac.erp.modules.vendor.controller;

import com.sac.erp.modules.vendor.entity.*;
import com.sac.erp.modules.vendor.repository.*;
import com.sac.erp.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors/reports")
@RequiredArgsConstructor
public class VendorReportController {

    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorPaymentRepository vendorPaymentRepository;
    private final PurchaseAgreementRepository purchaseAgreementRepository;

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam String type,
            @RequestParam(defaultValue = "csv") String format) {
        String schoolId = TenantContext.getCurrentTenant();
        StringBuilder csv = new StringBuilder();

        if (type.equalsIgnoreCase("vendor")) {
            csv.append("ID,Vendor Code,Vendor Name,Company Name,Type,Email,Mobile,Status\n");
            List<Vendor> list = vendorRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
            for (Vendor v : list) {
                csv.append(v.getId()).append(",")
                   .append(v.getVendorCode()).append(",")
                   .append(v.getVendorName()).append(",")
                   .append(v.getCompanyName()).append(",")
                   .append(v.getVendorType()).append(",")
                   .append(v.getEmail()).append(",")
                   .append(v.getMobile()).append(",")
                   .append(v.getStatus()).append("\n");
            }
        } else if (type.equalsIgnoreCase("purchase")) {
            csv.append("ID,PO Number,Vendor,Quantity,Total Rate,Status\n");
            List<PurchaseOrder> list = purchaseOrderRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
            for (PurchaseOrder po : list) {
                csv.append(po.getId()).append(",")
                   .append(po.getPoNumber()).append(",")
                   .append(po.getVendor().getVendorName()).append(",")
                   .append(po.getQuantity()).append(",")
                   .append(po.getRate()).append(",")
                   .append(po.getPoStatus()).append("\n");
            }
        } else if (type.equalsIgnoreCase("payment")) {
            csv.append("ID,Invoice Number,Vendor,Invoice Amount,Outstanding,Status\n");
            List<VendorPayment> list = vendorPaymentRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
            for (VendorPayment vp : list) {
                csv.append(vp.getId()).append(",")
                   .append(vp.getInvoiceNumber()).append(",")
                   .append(vp.getVendor().getVendorName()).append(",")
                   .append(vp.getInvoiceAmount()).append(",")
                   .append(vp.getOutstandingBalance()).append(",")
                   .append(vp.getPaymentStatus()).append("\n");
            }
        } else {
            csv.append("ID,Agreement Number,Vendor,Agreement Type,Effective Date,Expiry Date,Value,Status\n");
            List<PurchaseAgreement> list = purchaseAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
            for (PurchaseAgreement a : list) {
                csv.append(a.getId()).append(",")
                   .append(a.getAgreementNumber()).append(",")
                   .append(a.getVendor().getVendorName()).append(",")
                   .append(a.getAgreementType()).append(",")
                   .append(a.getEffectiveDate()).append(",")
                   .append(a.getExpiryDate()).append(",")
                   .append(a.getContractValue()).append(",")
                   .append(a.getApprovalStatus()).append("\n");
            }
        }

        byte[] out = csv.toString().getBytes();
        String filename = type + "_report." + format;
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out);
    }
}
