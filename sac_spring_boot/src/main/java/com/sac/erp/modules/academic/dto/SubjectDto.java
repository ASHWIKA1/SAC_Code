package com.sac.erp.modules.academic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubjectDto {
    private Long id;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    private String subjectCode;
    private String className;   // e.g. "Class 8", "Class 10"
    private Double passMark;

    @NotBlank(message = "Subject type (T/P) is required")
    private String subjectType; // T or P representation

    private Integer activeStatus;
    private Long academicId;
    private Long courseId;
    private Long schoolId;      // school FK — defaults to 1 if not provided
}
