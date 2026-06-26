package com.sac.erp.modules.hr.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PayrollGenerateDto {
    private Long id;
    private Double basicSalary;
    private Double totalEarning;
    private Double totalDeduction;
    private Double grossSalary;
    private Double tax;
    private Double netSalary;
    private String payrollMonth;
    private String payrollYear;
    private String payrollStatus; // NG, G, P
    private String paymentMode;
    private LocalDate paymentDate;
    private Integer bankId;
    private String note;
    private Integer activeStatus;
    private Integer paidAmount;
    private Integer isPartial;
    private Long staffId;
    private Long academicId;
}
