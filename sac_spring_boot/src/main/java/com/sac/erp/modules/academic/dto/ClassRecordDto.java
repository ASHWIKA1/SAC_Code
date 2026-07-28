package com.sac.erp.modules.academic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassRecordDto {
    private Long id;

    @NotBlank(message = "Class name is required")
    private String className;

    private Double passMark;
    private Integer activeStatus;
    private Long academicId;
    private Long schoolId; // school FK - defaults to 1
}
