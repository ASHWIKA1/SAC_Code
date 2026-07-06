package com.sac.erp.modules.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkMarksEntryDto {

    @NotNull(message = "Exam Term ID is required")
    private Long examTermId;

    @NotNull(message = "Exam Setup ID is required")
    private Long examSetupId;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Section ID is required")
    private Long sectionId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private Long academicId;

    @NotNull(message = "Marks list cannot be null")
    private List<StudentMarksDto> marks;
}
