package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.ConsultantDto;
import com.sac.erp.modules.vendor.entity.Consultant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ConsultantService {
    Consultant createConsultant(ConsultantDto dto, String schoolId, Long userId);
    Consultant updateConsultant(Long id, ConsultantDto dto, String schoolId, Long userId);
    Consultant getConsultantById(Long id, String schoolId);
    Page<Consultant> searchConsultants(String search, Pageable pageable, String schoolId);
    void deleteConsultant(Long id, String schoolId, Long userId);
    List<Consultant> getConsultantsBySchool(String schoolId);
}
