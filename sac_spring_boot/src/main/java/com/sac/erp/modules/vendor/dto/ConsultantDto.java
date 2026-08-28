package com.sac.erp.modules.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.math.BigDecimal;

@Getter
@Setter
public class ConsultantDto {
    private Long id;
    private String consultantIdStr;

    @NotBlank(message = "Consultant name is required")
    private String name;

    private String specialization;
    private Long departmentId;
    private Integer experienceYears;
    private BigDecimal hourlyRate;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private Long reportingManagerId;
    private Long agreementId;
    private Long ndaId;
    private BigDecimal performanceRating;
    private Integer invoicesSubmittedCount;
    private BigDecimal totalPayments;
    private String status;
}
