package com.sac.erp.modules.hr.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveDefineDto {
    private Long id;

    @NotNull(message = "Days is required")
    private Integer days;

    private Integer activeStatus = 1;
    private Long roleId;
    private Long userId;

    @NotNull(message = "Leave Type ID is required")
    private Long leaveTypeId;

    private Integer totalDays = 0;
    private Long academicId;
}
