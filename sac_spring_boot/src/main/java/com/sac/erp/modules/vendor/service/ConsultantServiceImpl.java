package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.ConsultantDto;
import com.sac.erp.modules.vendor.entity.Consultant;
import com.sac.erp.modules.vendor.entity.VendorAuditLog;
import com.sac.erp.modules.vendor.repository.ConsultantRepository;
import com.sac.erp.modules.vendor.repository.VendorAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ConsultantServiceImpl implements ConsultantService {

    private final ConsultantRepository consultantRepository;
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
    public Consultant createConsultant(ConsultantDto dto, String schoolId, Long userId) {
        Consultant c = new Consultant();
        c.setConsultantIdStr("CONS-" + (int)(Math.random() * 9000 + 1000));
        c.setName(dto.getName());
        c.setSpecialization(dto.getSpecialization());
        c.setDepartmentId(dto.getDepartmentId());
        c.setExperienceYears(dto.getExperienceYears() != null ? dto.getExperienceYears() : 0);
        c.setHourlyRate(dto.getHourlyRate() != null ? dto.getHourlyRate() : java.math.BigDecimal.ZERO);
        c.setContractStartDate(dto.getContractStartDate());
        c.setContractEndDate(dto.getContractEndDate());
        c.setReportingManagerId(dto.getReportingManagerId());
        c.setAgreementId(dto.getAgreementId());
        c.setNdaId(dto.getNdaId());
        if (dto.getPerformanceRating() != null) c.setPerformanceRating(dto.getPerformanceRating());
        c.setSchoolId(schoolId);
        c.setCreatedBy(userId);

        Consultant saved = consultantRepository.save(c);
        logAudit("CREATE_CONSULTANT", "Registered consultant: " + saved.getName() + " (ID: " + saved.getConsultantIdStr() + ")", schoolId);
        return saved;
    }

    @Override
    public Consultant updateConsultant(Long id, ConsultantDto dto, String schoolId, Long userId) {
        Consultant c = consultantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consultant not found"));
        c.setName(dto.getName());
        c.setSpecialization(dto.getSpecialization());
        c.setDepartmentId(dto.getDepartmentId());
        c.setExperienceYears(dto.getExperienceYears() != null ? dto.getExperienceYears() : c.getExperienceYears());
        c.setHourlyRate(dto.getHourlyRate() != null ? dto.getHourlyRate() : c.getHourlyRate());
        c.setContractStartDate(dto.getContractStartDate());
        c.setContractEndDate(dto.getContractEndDate());
        c.setReportingManagerId(dto.getReportingManagerId());
        c.setAgreementId(dto.getAgreementId());
        c.setNdaId(dto.getNdaId());
        if (dto.getPerformanceRating() != null) c.setPerformanceRating(dto.getPerformanceRating());
        if (dto.getStatus() != null) c.setStatus(dto.getStatus());
        c.setUpdatedBy(userId);

        Consultant updated = consultantRepository.save(c);
        logAudit("UPDATE_CONSULTANT", "Updated consultant: " + updated.getConsultantIdStr(), schoolId);
        return updated;
    }

    @Override
    public Consultant getConsultantById(Long id, String schoolId) {
        return consultantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consultant not found"));
    }

    @Override
    public Page<Consultant> searchConsultants(String search, Pageable pageable, String schoolId) {
        return consultantRepository.searchConsultants(schoolId, search, pageable);
    }

    @Override
    public void deleteConsultant(Long id, String schoolId, Long userId) {
        Consultant c = consultantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consultant not found"));
        c.setIsDeleted(1);
        c.setUpdatedBy(userId);
        consultantRepository.save(c);
        logAudit("DELETE_CONSULTANT", "Soft deleted consultant " + c.getConsultantIdStr(), schoolId);
    }

    @Override
    public List<Consultant> getConsultantsBySchool(String schoolId) {
        return consultantRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }
}
