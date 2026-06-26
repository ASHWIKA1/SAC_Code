package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.dto.ClassRecordDto;
import java.util.List;

public interface ClassService {
    List<ClassRecordDto> getAllClasses();
    ClassRecordDto getClassById(Long id);
    ClassRecordDto createClass(ClassRecordDto dto);
    ClassRecordDto updateClass(Long id, ClassRecordDto dto);
    void deleteClass(Long id);
}
