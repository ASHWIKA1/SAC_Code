package com.sac.erp.modules.hr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveTypeDto {
    private Long id;

    @NotBlank(message = "Leave type is required")
    private String type;

    @NotNull(message = "Total days is required")
    private Integer totalDays;

    private Integer activeStatus = 1;
    private Long academicId;
}
