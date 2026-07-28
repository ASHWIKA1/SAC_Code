package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.VendorPaymentDto;
import com.sac.erp.modules.vendor.entity.PurchaseOrder;
import com.sac.erp.modules.vendor.entity.Vendor;
import com.sac.erp.modules.vendor.entity.VendorAuditLog;
import com.sac.erp.modules.vendor.entity.VendorPayment;
import com.sac.erp.modules.vendor.repository.PurchaseOrderRepository;
import com.sac.erp.modules.vendor.repository.VendorAuditLogRepository;
import com.sac.erp.modules.vendor.repository.VendorPaymentRepository;
import com.sac.erp.modules.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VendorPaymentServiceImpl implements VendorPaymentService {

    private final VendorPaymentRepository vendorPaymentRepository;
    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorAuditLogRepository vendorAuditLogRepository;

    private void logAudit(String action, String details, String schoolId) {
        VendorAuditLog log = new VendorAuditLog();
        log.setAction(action);
        log.setDetails(details);
        log.setPerformedBy("System/User");
        log.setSchoolId(schoolId);
        vendorAuditLogRepository.save(log);
    }

    @Override
    public VendorPayment createPayment(VendorPaymentDto dto, String schoolId, Long userId) {
        Vendor v = vendorRepository.findByIdAndSchoolIdAndIsDeleted(dto.getVendorId(), schoolId, 0)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        
        PurchaseOrder po = null;
        if (dto.getPoId() != null) {
            po = purchaseOrderRepository.findById(dto.getPoId()).orElse(null);
        }

        VendorPayment vp = new VendorPayment();
        vp.setInvoiceNumber(dto.getInvoiceNumber());
        vp.setVendor(v);
        vp.setPurchaseOrder(po);
        vp.setFileUrl(dto.getFileUrl());
        
        // Auto tax calculation if not provided: GST is 18%, TDS is 2%
        BigDecimal invoiceAmt = dto.getInvoiceAmount() != null ? dto.getInvoiceAmount() : BigDecimal.ZERO;
        BigDecimal gst = dto.getGstAmount() != null ? dto.getGstAmount() : invoiceAmt.multiply(BigDecimal.valueOf(0.18));
        BigDecimal tds = dto.getTdsAmount() != null ? dto.getTdsAmount() : invoiceAmt.multiply(BigDecimal.valueOf(0.02));
        BigDecimal tax = gst.add(tds);

        vp.setInvoiceAmount(invoiceAmt);
        vp.setGstAmount(gst);
        vp.setTdsAmount(tds);
        vp.setTaxAmount(tax);
        
        // Outstanding is invoice + gst - tds
        BigDecimal netOutstanding = invoiceAmt.add(gst).subtract(tds);
        vp.setOutstandingBalance(netOutstanding);
        vp.setPaymentRequestStatus("Pending Approval");
        vp.setPaymentStatus("Unpaid");
        vp.setSchoolId(schoolId);
        vp.setCreatedBy(userId);

        VendorPayment saved = vendorPaymentRepository.save(vp);
        logAudit("CREATE_PAYMENT", "Invoice logged: " + saved.getInvoiceNumber() + ", net outstanding: " + saved.getOutstandingBalance(), schoolId);
        return saved;
    }

    @Override
    public VendorPayment updatePayment(Long id, VendorPaymentDto dto, String schoolId, Long userId) {
        VendorPayment vp = vendorPaymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        vp.setInvoiceNumber(dto.getInvoiceNumber());
        if (dto.getInvoiceAmount() != null) {
            vp.setInvoiceAmount(dto.getInvoiceAmount());
        }
        if (dto.getGstAmount() != null) vp.setGstAmount(dto.getGstAmount());
        if (dto.getTdsAmount() != null) vp.setTdsAmount(dto.getTdsAmount());
        if (dto.getTaxAmount() != null) vp.setTaxAmount(dto.getTaxAmount());
        if (dto.getOutstandingBalance() != null) vp.setOutstandingBalance(dto.getOutstandingBalance());
        if (dto.getPaymentRequestStatus() != null) vp.setPaymentRequestStatus(dto.getPaymentRequestStatus());
        if (dto.getPaymentStatus() != null) vp.setPaymentStatus(dto.getPaymentStatus());
        if (dto.getBankTransferDetails() != null) vp.setBankTransferDetails(dto.getBankTransferDetails());
        vp.setUpdatedBy(userId);

        VendorPayment updated = vendorPaymentRepository.save(vp);
        logAudit("UPDATE_PAYMENT", "Updated invoice payment info: " + updated.getInvoiceNumber(), schoolId);
        return updated;
    }

    @Override
    public VendorPayment getPaymentById(Long id, String schoolId) {
        return vendorPaymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
    }

    @Override
    public Page<VendorPayment> searchPayments(String search, Pageable pageable, String schoolId) {
        return vendorPaymentRepository.searchPayments(schoolId, search, pageable);
    }

    @Override
    public VendorPayment verifyInvoice(Long id, String status, String schoolId, Long userId) {
        VendorPayment vp = vendorPaymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        vp.setPaymentRequestStatus(status);
        vp.setUpdatedBy(userId);
        VendorPayment saved = vendorPaymentRepository.save(vp);
        logAudit("VERIFY_INVOICE", "Invoice ID: " + saved.getId() + " set verification status to " + status, schoolId);
        return saved;
    }

    @Override
    public VendorPayment makePayment(Long id, String bankTransferDetails, String schoolId, Long userId) {
        VendorPayment vp = vendorPaymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        vp.setBankTransferDetails(bankTransferDetails);
        vp.setPaymentStatus("Paid");
        vp.setOutstandingBalance(BigDecimal.ZERO); // Cleared
        vp.setUpdatedBy(userId);

        VendorPayment saved = vendorPaymentRepository.save(vp);
        logAudit("MAKE_PAYMENT", "Payment completed for invoice " + saved.getInvoiceNumber() + ", bank ref: " + bankTransferDetails, schoolId);
        return saved;
    }

    @Override
    public List<VendorPayment> getPaymentsBySchool(String schoolId) {
        return vendorPaymentRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }
}
