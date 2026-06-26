package com.sac.erp.modules.academic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionDto {
    private Long id;

    @NotBlank(message = "Section name is required")
    private String sectionName;

    private Integer activeStatus;
    private Long academicId;
}
