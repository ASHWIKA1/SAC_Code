package com.sac.erp.modules.hr.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LeaveRequestDto {
    private Long id;

    @NotNull(message = "Apply date is required")
    private LocalDate applyDate;

    @NotNull(message = "Leave start date is required")
    private LocalDate leaveFrom;

    @NotNull(message = "Leave end date is required")
    private LocalDate leaveTo;

    private String reason;
    private String note;
    private String file;
    private String approveStatus = "P";
    private Integer activeStatus = 1;

    @NotNull(message = "Leave definition ID is required")
    private Long leaveDefineId;

    private Long staffId;
    private Long roleId;
    private Long leaveTypeId;
    private Long academicId;
}
