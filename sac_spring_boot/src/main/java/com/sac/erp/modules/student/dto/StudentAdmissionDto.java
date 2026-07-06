package com.sac.erp.modules.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class StudentAdmissionDto {

    @NotBlank(message = "Admission number is required")
    private String admissionNo;

    private Integer rollNo;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String mobile;

    private String email;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Section ID is required")
    private Long sectionId;

    // Parent details
    private String fathersName;
    private String fathersMobile;
    private String fathersOccupation;
    private String mothersName;
    private String guardiansName;
    private String guardiansMobile;
    private String guardiansRelation;
}
