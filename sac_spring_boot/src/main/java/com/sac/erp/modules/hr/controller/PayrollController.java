package com.sac.erp.modules.hr.controller;

import com.sac.erp.modules.hr.dto.PayrollGenerateDto;
import com.sac.erp.modules.hr.entity.PayrollGenerate;
import com.sac.erp.modules.hr.service.HrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/hr/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final HrService hrService;

    @PostMapping("/generate")
    public ResponseEntity<PayrollGenerateDto> generatePayroll(
            @RequestParam Long staffId,
            @RequestParam String month,
            @RequestParam String year) {
        log.info("REST request to generate payroll for staff: {} for month/year: {}/{}", staffId, month, year);
        PayrollGenerate payroll = hrService.generatePayroll(staffId, month, year);
        return ResponseEntity.ok(toDto(payroll));
    }

    @PostMapping("/pay/{payrollId}")
    public ResponseEntity<PayrollGenerateDto> payPayroll(
            @PathVariable Long payrollId,
            @RequestParam String paymentMode,
            @RequestParam(required = false) String note) {
        log.info("REST request to pay payroll ID: {} using mode: {}", payrollId, paymentMode);
        PayrollGenerate payroll = hrService.payPayroll(payrollId, paymentMode, note);
        return ResponseEntity.ok(toDto(payroll));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<PayrollGenerateDto>> getPayrollByStaff(@PathVariable Long staffId) {
        log.info("REST request to get payroll for staff ID: {}", staffId);
        List<PayrollGenerateDto> list = hrService.getPayrollByStaff(staffId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PayrollGenerateDto>> getPayrollHistory(
            @RequestParam String month,
            @RequestParam String year) {
        log.info("REST request to get payroll history for month/year: {}/{}", month, year);
        List<PayrollGenerateDto> list = hrService.getPayrollHistory(month, year).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private PayrollGenerateDto toDto(PayrollGenerate entity) {
        PayrollGenerateDto dto = new PayrollGenerateDto();
        dto.setId(entity.getId());
        dto.setBasicSalary(entity.getBasicSalary());
        dto.setTotalEarning(entity.getTotalEarning());
        dto.setTotalDeduction(entity.getTotalDeduction());
        dto.setGrossSalary(entity.getGrossSalary());
        dto.setTax(entity.getTax());
        dto.setNetSalary(entity.getNetSalary());
        dto.setPayrollMonth(entity.getPayrollMonth());
        dto.setPayrollYear(entity.getPayrollYear());
        dto.setPayrollStatus(entity.getPayrollStatus());
        dto.setPaymentMode(entity.getPaymentMode());
        dto.setPaymentDate(entity.getPaymentDate());
        dto.setBankId(entity.getBankId());
        dto.setNote(entity.getNote());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setPaidAmount(entity.getPaidAmount());
        dto.setIsPartial(entity.getIsPartial());
        dto.setAcademicId(entity.getAcademicId());
        if (entity.getStaff() != null) {
            dto.setStaffId(entity.getStaff().getId());
        }
        return dto;
    }
}
