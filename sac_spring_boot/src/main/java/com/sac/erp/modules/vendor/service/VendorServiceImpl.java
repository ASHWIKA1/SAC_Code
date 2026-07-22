package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.*;
import com.sac.erp.modules.vendor.entity.*;
import com.sac.erp.modules.vendor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final VendorDocumentRepository vendorDocumentRepository;
    private final NdaAgreementRepository ndaAgreementRepository;
    private final MouAgreementRepository mouAgreementRepository;
    private final PurchaseAgreementRepository purchaseAgreementRepository;
    private final VendorPerformanceRepository vendorPerformanceRepository;
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
    public Vendor createVendor(VendorDto dto, String schoolId, Long userId) {
        Vendor v = new Vendor();
        // Generate random vendor code if not present
        v.setVendorCode("VEND-" + (int)(Math.random() * 9000 + 1000));
        v.setVendorName(dto.getVendorName());
        v.setVendorType(dto.getVendorType());
        v.setCompanyName(dto.getCompanyName());
        v.setGstNumber(dto.getGstNumber());
        v.setPanNumber(dto.getPanNumber());
        v.setTanNumber(dto.getTanNumber());
        v.setMsmeStatus(dto.getMsmeStatus());
        v.setMsmeRegistrationNumber(dto.getMsmeRegistrationNumber());
        v.setUdyamNumber(dto.getUdyamNumber());
        v.setCinNumber(dto.getCinNumber());
        v.setIecNumber(dto.getIecNumber());
        v.setVendorCategory(dto.getVendorCategory());
        v.setIndustryType(dto.getIndustryType());
        v.setBusinessNature(dto.getBusinessNature());
        v.setEstablishmentYear(dto.getEstablishmentYear());
        v.setWebsite(dto.getWebsite());
        v.setContactPerson(dto.getContactPerson());
        v.setMobile(dto.getMobile());
        v.setAlternateMobile(dto.getAlternateMobile());
        v.setEmail(dto.getEmail());
        v.setAlternateEmail(dto.getAlternateEmail());
        v.setBillingAddress(dto.getBillingAddress());
        v.setShippingAddress(dto.getShippingAddress());
        v.setCountry(dto.getCountry());
        v.setState(dto.getState());
        v.setDistrict(dto.getDistrict());
        v.setCity(dto.getCity());
        v.setPincode(dto.getPincode());
        v.setAccountHolder(dto.getAccountHolder());
        v.setAccountNumber(dto.getAccountNumber());
        v.setIfsc(dto.getIfsc());
        v.setBankName(dto.getBankName());
        v.setBranch(dto.getBranch());
        v.setStatus("Active");
        v.setSchoolId(schoolId);
        v.setCreatedBy(userId);

        Vendor saved = vendorRepository.save(v);
        logAudit("CREATE_VENDOR", "Created vendor with code " + saved.getVendorCode() + " and name " + saved.getVendorName(), schoolId);
        return saved;
    }

    @Override
    public Vendor updateVendor(Long id, VendorDto dto, String schoolId, Long userId) {
        Vendor v = vendorRepository.findByIdAndSchoolIdAndIsDeleted(id, schoolId, 0)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        v.setVendorName(dto.getVendorName());
        v.setVendorType(dto.getVendorType());
        v.setCompanyName(dto.getCompanyName());
        v.setGstNumber(dto.getGstNumber());
        v.setPanNumber(dto.getPanNumber());
        v.setTanNumber(dto.getTanNumber());
        v.setMsmeStatus(dto.getMsmeStatus());
        v.setMsmeRegistrationNumber(dto.getMsmeRegistrationNumber());
        v.setUdyamNumber(dto.getUdyamNumber());
        v.setCinNumber(dto.getCinNumber());
        v.setIecNumber(dto.getIecNumber());
        v.setVendorCategory(dto.getVendorCategory());
        v.setIndustryType(dto.getIndustryType());
        v.setBusinessNature(dto.getBusinessNature());
        v.setEstablishmentYear(dto.getEstablishmentYear());
        v.setWebsite(dto.getWebsite());
        v.setContactPerson(dto.getContactPerson());
        v.setMobile(dto.getMobile());
        v.setAlternateMobile(dto.getAlternateMobile());
        v.setEmail(dto.getEmail());
        v.setAlternateEmail(dto.getAlternateEmail());
        v.setBillingAddress(dto.getBillingAddress());
        v.setShippingAddress(dto.getShippingAddress());
        v.setCountry(dto.getCountry());
        v.setState(dto.getState());
        v.setDistrict(dto.getDistrict());
        v.setCity(dto.getCity());
        v.setPincode(dto.getPincode());
        v.setAccountHolder(dto.getAccountHolder());
        v.setAccountNumber(dto.getAccountNumber());
        v.setIfsc(dto.getIfsc());
        v.setBankName(dto.getBankName());
        v.setBranch(dto.getBranch());
        if (dto.getStatus() != null) {
            v.setStatus(dto.getStatus());
        }
        v.setUpdatedBy(userId);

        Vendor updated = vendorRepository.save(v);
        logAudit("UPDATE_VENDOR", "Updated vendor profile for " + updated.getVendorCode(), schoolId);
        return updated;
    }

    @Override
    public Vendor getVendorById(Long id, String schoolId) {
        return vendorRepository.findByIdAndSchoolIdAndIsDeleted(id, schoolId, 0)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with id " + id));
    }

    @Override
    public Page<Vendor> searchVendors(String search, Pageable pageable, String schoolId) {
        return vendorRepository.searchVendors(schoolId, search, pageable);
    }

    @Override
    public void deleteVendor(Long id, String schoolId, Long userId) {
        Vendor v = vendorRepository.findByIdAndSchoolIdAndIsDeleted(id, schoolId, 0)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        v.setIsDeleted(1);
        v.setUpdatedBy(userId);
        vendorRepository.save(v);
        logAudit("DELETE_VENDOR", "Soft deleted vendor " + v.getVendorCode(), schoolId);
    }

    @Override
    public VendorDocument uploadDocument(VendorDocumentDto dto, String schoolId, Long userId) {
        Vendor v = getVendorById(dto.getVendorId(), schoolId);
        VendorDocument doc = new VendorDocument();
        doc.setVendor(v);
        doc.setDocumentType(dto.getDocumentType());
        doc.setDocumentNumber(dto.getDocumentNumber());
        doc.setFileUrl(dto.getFileUrl());
        doc.setIssueDate(dto.getIssueDate());
        doc.setExpiryDate(dto.getExpiryDate());
        if (dto.getReminderBeforeExpiryDays() != null) {
            doc.setReminderBeforeExpiryDays(dto.getReminderBeforeExpiryDays());
        }
        doc.setStatus("Pending");
        doc.setRemarks(dto.getRemarks());
        doc.setSchoolId(schoolId);
        doc.setCreatedBy(userId);

        VendorDocument saved = vendorDocumentRepository.save(doc);
        logAudit("UPLOAD_DOCUMENT", "Uploaded document: " + saved.getDocumentType() + " for vendor " + v.getVendorCode(), schoolId);
        return saved;
    }

    @Override
    public List<VendorDocument> getDocumentsByVendor(Long vendorId, String schoolId) {
        Vendor v = getVendorById(vendorId, schoolId);
        return vendorDocumentRepository.findByVendorIdAndIsDeleted(v.getId(), 0);
    }

    @Override
    public VendorDocument verifyDocument(Long id, String status, String remarks, String schoolId, String username) {
        VendorDocument doc = vendorDocumentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        doc.setStatus(status);
        doc.setRemarks(remarks);
        doc.setVerifiedBy(username);
        doc.setVerifiedDate(LocalDate.now());

        VendorDocument saved = vendorDocumentRepository.save(doc);
        logAudit("VERIFY_DOCUMENT", "Verified document ID: " + saved.getId() + " status set to " + status, schoolId);
        return saved;
    }

    @Override
    public List<VendorDocument> getExpiredDocuments(String schoolId) {
        return vendorDocumentRepository.findBySchoolIdAndIsDeleted(schoolId, 0).stream()
                .filter(d -> d.getExpiryDate() != null && d.getExpiryDate().isBefore(LocalDate.now()))
                .toList();
    }

    @Override
    public NdaAgreement createNda(NdaAgreementDto dto, String schoolId, Long userId) {
        Vendor v = getVendorById(dto.getVendorId(), schoolId);
        NdaAgreement nda = new NdaAgreement();
        nda.setVendor(v);
        nda.setNdaNumber(dto.getNdaNumber());
        nda.setEffectiveDate(dto.getEffectiveDate());
        nda.setExpiryDate(dto.getExpiryDate());
        nda.setDepartmentId(dto.getDepartmentId());
        if (dto.getConfidentialityLevel() != null) {
            nda.setConfidentialityLevel(dto.getConfidentialityLevel());
        }
        nda.setFileUrl(dto.getFileUrl());
        nda.setStatus("Active");
        nda.setSchoolId(schoolId);
        nda.setCreatedBy(userId);

        NdaAgreement saved = ndaAgreementRepository.save(nda);
        logAudit("CREATE_NDA", "NDA agreement created: " + saved.getNdaNumber() + " with vendor " + v.getVendorCode(), schoolId);
        return saved;
    }

    @Override
    public List<NdaAgreement> getNdasByVendor(Long vendorId, String schoolId) {
        return ndaAgreementRepository.findByVendorIdAndIsDeleted(vendorId, 0);
    }

    @Override
    public List<NdaAgreement> getActiveNdas(String schoolId) {
        return ndaAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }

    @Override
    public MouAgreement createMou(MouAgreementDto dto, String schoolId, Long userId) {
        Vendor v = getVendorById(dto.getVendorId(), schoolId);
        MouAgreement mou = new MouAgreement();
        mou.setVendor(v);
        mou.setMouNumber(dto.getMouNumber());
        mou.setPurpose(dto.getPurpose());
        mou.setStartDate(dto.getStartDate());
        mou.setEndDate(dto.getEndDate());
        mou.setDepartmentId(dto.getDepartmentId());
        if (dto.getContractValue() != null) {
            mou.setContractValue(dto.getContractValue());
        }
        mou.setFileUrl(dto.getFileUrl());
        mou.setApprovalStatus("Pending");
        mou.setSchoolId(schoolId);
        mou.setCreatedBy(userId);

        MouAgreement saved = mouAgreementRepository.save(mou);
        logAudit("CREATE_MOU", "MOU agreement created: " + saved.getMouNumber() + " with vendor " + v.getVendorCode(), schoolId);
        return saved;
    }

    @Override
    public List<MouAgreement> getMousByVendor(Long vendorId, String schoolId) {
        return mouAgreementRepository.findByVendorIdAndIsDeleted(vendorId, 0);
    }

    @Override
    public MouAgreement approveMou(Long id, String status, String schoolId, Long userId) {
        MouAgreement mou = mouAgreementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MOU not found"));
        mou.setApprovalStatus(status);
        mou.setUpdatedBy(userId);
        MouAgreement saved = mouAgreementRepository.save(mou);
        logAudit("APPROVE_MOU", "MOU ID: " + saved.getId() + " set approval status to " + status, schoolId);
        return saved;
    }

    @Override
    public PurchaseAgreement createAgreement(PurchaseAgreementDto dto, String schoolId, Long userId) {
        Vendor v = getVendorById(dto.getVendorId(), schoolId);
        PurchaseAgreement ag = new PurchaseAgreement();
        ag.setVendor(v);
        ag.setAgreementNumber(dto.getAgreementNumber());
        ag.setAgreementType(dto.getAgreementType());
        ag.setEffectiveDate(dto.getEffectiveDate());
        ag.setExpiryDate(dto.getExpiryDate());
        if (dto.getContractValue() != null) {
            ag.setContractValue(dto.getContractValue());
        }
        ag.setRenewalDate(dto.getRenewalDate());
        ag.setPenaltyClause(dto.getPenaltyClause());
        ag.setTermsConditions(dto.getTermsConditions());
        ag.setFileUrl(dto.getFileUrl());
        ag.setApprovalStatus("Pending");
        ag.setSchoolId(schoolId);
        ag.setCreatedBy(userId);

        PurchaseAgreement saved = purchaseAgreementRepository.save(ag);
        logAudit("CREATE_AGREEMENT", "Agreement created: " + saved.getAgreementNumber() + " with vendor " + v.getVendorCode(), schoolId);
        return saved;
    }

    @Override
    public List<PurchaseAgreement> getAgreementsByVendor(Long vendorId, String schoolId) {
        return purchaseAgreementRepository.findByVendorIdAndIsDeleted(vendorId, 0);
    }

    @Override
    public PurchaseAgreement approveAgreement(Long id, String status, String schoolId, Long userId) {
        PurchaseAgreement ag = purchaseAgreementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found"));
        ag.setApprovalStatus(status);
        ag.setUpdatedBy(userId);
        PurchaseAgreement saved = purchaseAgreementRepository.save(ag);
        logAudit("APPROVE_AGREEMENT", "Agreement ID: " + saved.getId() + " set approval status to " + status, schoolId);
        return saved;
    }

    @Override
    public VendorPerformance savePerformance(VendorPerformanceDto dto, String schoolId, Long userId) {
        Vendor v = getVendorById(dto.getVendorId(), schoolId);
        VendorPerformance p = vendorPerformanceRepository.findByVendorIdAndIsDeleted(v.getId(), 0)
                .orElse(new VendorPerformance());
        p.setVendor(v);
        if (dto.getDeliveryPerformance() != null) p.setDeliveryPerformance(dto.getDeliveryPerformance());
        if (dto.getQualityRating() != null) p.setQualityRating(dto.getQualityRating());
        if (dto.getCommunication() != null) p.setCommunication(dto.getCommunication());
        if (dto.getResponseTime() != null) p.setResponseTime(dto.getResponseTime());
        if (dto.getPricing() != null) p.setPricing(dto.getPricing());
        if (dto.getComplaintCount() != null) p.setComplaintCount(dto.getComplaintCount());
        if (dto.getRejectedMaterials() != null) p.setRejectedMaterials(dto.getRejectedMaterials());
        if (dto.getCompliance() != null) p.setCompliance(dto.getCompliance());
        if (dto.getBlacklistRecommendation() != null) p.setBlacklistRecommendation(dto.getBlacklistRecommendation());
        if (dto.getFeedback() != null) p.setFeedback(dto.getFeedback());

        // Calculate overall score: average of 6 rating components out of 5
        double totalScore = p.getDeliveryPerformance().doubleValue()
                + p.getQualityRating().doubleValue()
                + p.getCommunication().doubleValue()
                + p.getResponseTime().doubleValue()
                + p.getPricing().doubleValue()
                + p.getCompliance().doubleValue();
        double avg = totalScore / 6.0;
        p.setOverallRating(BigDecimal.valueOf(avg));

        if (avg >= 4.5) {
            p.setRatingLevel("Excellent");
        } else if (avg >= 3.5) {
            p.setRatingLevel("Good");
        } else if (avg >= 2.5) {
            p.setRatingLevel("Average");
        } else {
            p.setRatingLevel("Poor");
        }
        
        p.setSchoolId(schoolId);
        if (p.getId() == null) {
            p.setCreatedBy(userId);
        } else {
            p.setUpdatedBy(userId);
        }

        VendorPerformance saved = vendorPerformanceRepository.save(p);
        logAudit("SAVE_PERFORMANCE", "Performance score updated for vendor " + v.getVendorCode() + " rating level " + saved.getRatingLevel(), schoolId);
        return saved;
    }

    @Override
    public VendorPerformance getPerformanceByVendor(Long vendorId, String schoolId) {
        Vendor v = getVendorById(vendorId, schoolId);
        return vendorPerformanceRepository.findByVendorIdAndIsDeleted(v.getId(), 0)
                .orElse(null);
    }

    @Override
    public List<VendorPerformance> getAllPerformances(String schoolId) {
        return vendorPerformanceRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }

    @Override
    public List<MouAgreement> getActiveMous(String schoolId) {
        return mouAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }

    @Override
    public List<PurchaseAgreement> getActiveAgreements(String schoolId) {
        return purchaseAgreementRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }
}
