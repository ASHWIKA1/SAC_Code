package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.dto.ClassRecordDto;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRecordRepository classRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ClassRecordDto> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClassRecordDto getClassById(Long id) {
        ClassRecord classRecord = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        return convertToDto(classRecord);
    }

    @Override
    @Transactional
    public ClassRecordDto createClass(ClassRecordDto dto) {
        ClassRecord classRecord = new ClassRecord();
        classRecord.setClassName(dto.getClassName());
        classRecord.setPassMark(dto.getPassMark());
        classRecord.setActiveStatus(dto.getActiveStatus() != null ? dto.getActiveStatus() : 1);
        classRecord.setAcademicId(dto.getAcademicId() != null ? dto.getAcademicId() : 1L);
        classRecord.setSchoolId(dto.getSchoolId() != null ? String.valueOf(dto.getSchoolId()) : "1");

        ClassRecord saved = classRepository.save(classRecord);
        return convertToDto(saved);
    }

    @Override
    @Transactional
    public ClassRecordDto updateClass(Long id, ClassRecordDto dto) {
        ClassRecord classRecord = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        
        classRecord.setClassName(dto.getClassName());
        classRecord.setPassMark(dto.getPassMark());
        if (dto.getActiveStatus() != null) {
            classRecord.setActiveStatus(dto.getActiveStatus());
        }
        classRecord.setAcademicId(dto.getAcademicId() != null ? dto.getAcademicId() : 1L);
        if (dto.getSchoolId() != null) {
            classRecord.setSchoolId(String.valueOf(dto.getSchoolId()));
        }

        ClassRecord updated = classRepository.save(classRecord);
        return convertToDto(updated);
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        ClassRecord classRecord = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        classRepository.delete(classRecord);
    }

    private ClassRecordDto convertToDto(ClassRecord entity) {
        ClassRecordDto dto = new ClassRecordDto();
        dto.setId(entity.getId());
        dto.setClassName(entity.getClassName());
        dto.setPassMark(entity.getPassMark());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setAcademicId(entity.getAcademicId());
        if (entity.getSchoolId() != null) {
            try {
                dto.setSchoolId(Long.parseLong(entity.getSchoolId()));
            } catch (NumberFormatException e) {
                dto.setSchoolId(1L);
            }
        }
        return dto;
    }
}
