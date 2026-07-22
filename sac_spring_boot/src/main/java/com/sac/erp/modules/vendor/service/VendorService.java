package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.*;
import com.sac.erp.modules.vendor.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VendorService {
    // Vendor General Profile
    Vendor createVendor(VendorDto dto, String schoolId, Long userId);
    Vendor updateVendor(Long id, VendorDto dto, String schoolId, Long userId);
    Vendor getVendorById(Long id, String schoolId);
    Page<Vendor> searchVendors(String search, Pageable pageable, String schoolId);
    void deleteVendor(Long id, String schoolId, Long userId);

    // Vendor Documents
    VendorDocument uploadDocument(VendorDocumentDto dto, String schoolId, Long userId);
    List<VendorDocument> getDocumentsByVendor(Long vendorId, String schoolId);
    VendorDocument verifyDocument(Long id, String status, String remarks, String schoolId, String username);
    List<VendorDocument> getExpiredDocuments(String schoolId);

    // NDA Management
    NdaAgreement createNda(NdaAgreementDto dto, String schoolId, Long userId);
    List<NdaAgreement> getNdasByVendor(Long vendorId, String schoolId);
    List<NdaAgreement> getActiveNdas(String schoolId);

    // MOU Management
    MouAgreement createMou(MouAgreementDto dto, String schoolId, Long userId);
    List<MouAgreement> getMousByVendor(Long vendorId, String schoolId);
    MouAgreement approveMou(Long id, String status, String schoolId, Long userId);
    List<MouAgreement> getActiveMous(String schoolId);

    // Agreements
    PurchaseAgreement createAgreement(PurchaseAgreementDto dto, String schoolId, Long userId);
    List<PurchaseAgreement> getAgreementsByVendor(Long vendorId, String schoolId);
    PurchaseAgreement approveAgreement(Long id, String status, String schoolId, Long userId);
    List<PurchaseAgreement> getActiveAgreements(String schoolId);

    // Performance
    VendorPerformance savePerformance(VendorPerformanceDto dto, String schoolId, Long userId);
    VendorPerformance getPerformanceByVendor(Long vendorId, String schoolId);
    List<VendorPerformance> getAllPerformances(String schoolId);
}
