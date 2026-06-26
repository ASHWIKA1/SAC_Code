package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.dto.SectionDto;
import java.util.List;

public interface SectionService {
    List<SectionDto> getAllSections();
    SectionDto getSectionById(Long id);
    SectionDto createSection(SectionDto dto);
    SectionDto updateSection(Long id, SectionDto dto);
    void deleteSection(Long id);
}
