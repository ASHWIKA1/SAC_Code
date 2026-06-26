package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.dto.SectionDto;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SectionDto> getAllSections() {
        return sectionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SectionDto getSectionById(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        return convertToDto(section);
    }

    @Override
    @Transactional
    public SectionDto createSection(SectionDto dto) {
        Section section = new Section();
        section.setSectionName(dto.getSectionName());
        section.setActiveStatus(dto.getActiveStatus() != null ? dto.getActiveStatus() : 1);
        section.setAcademicId(dto.getAcademicId());

        Section saved = sectionRepository.save(section);
        return convertToDto(saved);
    }

    @Override
    @Transactional
    public SectionDto updateSection(Long id, SectionDto dto) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        section.setSectionName(dto.getSectionName());
        if (dto.getActiveStatus() != null) {
            section.setActiveStatus(dto.getActiveStatus());
        }
        section.setAcademicId(dto.getAcademicId());

        Section updated = sectionRepository.save(section);
        return convertToDto(updated);
    }

    @Override
    @Transactional
    public void deleteSection(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        sectionRepository.delete(section);
    }

    private SectionDto convertToDto(Section entity) {
        SectionDto dto = new SectionDto();
        dto.setId(entity.getId());
        dto.setSectionName(entity.getSectionName());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setAcademicId(entity.getAcademicId());
        return dto;
    }
}
