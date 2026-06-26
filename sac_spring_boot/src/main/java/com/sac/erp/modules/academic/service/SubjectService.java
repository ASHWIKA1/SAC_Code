package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.dto.SubjectDto;
import java.util.List;

public interface SubjectService {
    List<SubjectDto> getAllSubjects();
    SubjectDto getSubjectById(Long id);
    SubjectDto createSubject(SubjectDto dto);
    SubjectDto updateSubject(Long id, SubjectDto dto);
    void deleteSubject(Long id);
}
