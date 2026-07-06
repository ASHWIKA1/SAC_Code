package com.sac.erp.modules.hr.repository;

import com.sac.erp.modules.hr.entity.PayrollGenerate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollGenerateRepository extends JpaRepository<PayrollGenerate, Long> {
    List<PayrollGenerate> findByStaffId(Long staffId);
    Optional<PayrollGenerate> findByStaffIdAndPayrollMonthAndPayrollYear(Long staffId, String payrollMonth, String payrollYear);
    List<PayrollGenerate> findByPayrollMonthAndPayrollYear(String payrollMonth, String payrollYear);
}
