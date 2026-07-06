package com.sac.erp.modules.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentMarksDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Marks value is required")
    private Double totalMarks;

    private Integer isAbsent = 0; // 0 = present, 1 = absent
    private String teacherRemarks;
}
