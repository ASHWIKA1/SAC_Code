package com.sac.erp.modules.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentAttendanceDto {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Attendance type is required")
    private String attendanceType; // P, L, A, H, F

    private String notes;
}
