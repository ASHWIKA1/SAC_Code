package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.dto.SubjectDto;
import com.sac.erp.modules.academic.entity.Subject;
import com.sac.erp.modules.academic.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return convertToDto(subject);
    }

    @Override
    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        Subject subject = new Subject();
        subject.setSubjectName(dto.getSubjectName());
        subject.setSubjectCode(dto.getSubjectCode());
        subject.setPassMark(dto.getPassMark());
        subject.setSubjectType(Subject.SubjectType.valueOf(dto.getSubjectType().toUpperCase()));
        subject.setActiveStatus(dto.getActiveStatus() != null ? dto.getActiveStatus() : 1);
        subject.setAcademicId(dto.getAcademicId());

        Subject saved = subjectRepository.save(subject);
        return convertToDto(saved);
    }

    @Override
    @Transactional
    public SubjectDto updateSubject(Long id, SubjectDto dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        subject.setSubjectName(dto.getSubjectName());
        subject.setSubjectCode(dto.getSubjectCode());
        subject.setPassMark(dto.getPassMark());
        subject.setSubjectType(Subject.SubjectType.valueOf(dto.getSubjectType().toUpperCase()));
        if (dto.getActiveStatus() != null) {
            subject.setActiveStatus(dto.getActiveStatus());
        }
        subject.setAcademicId(dto.getAcademicId());

        Subject updated = subjectRepository.save(subject);
        return convertToDto(updated);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        subjectRepository.delete(subject);
    }

    private SubjectDto convertToDto(Subject entity) {
        SubjectDto dto = new SubjectDto();
        dto.setId(entity.getId());
        dto.setSubjectName(entity.getSubjectName());
        dto.setSubjectCode(entity.getSubjectCode());
        dto.setPassMark(entity.getPassMark());
        dto.setSubjectType(entity.getSubjectType().name());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setAcademicId(entity.getAcademicId());
        return dto;
    }
}
