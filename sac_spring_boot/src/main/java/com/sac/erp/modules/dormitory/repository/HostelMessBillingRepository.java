package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.HostelMessBilling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostelMessBillingRepository extends JpaRepository<HostelMessBilling, Long> {
    List<HostelMessBilling> findByStudentId(Long studentId);
    List<HostelMessBilling> findByBillingMonth(String billingMonth);
    List<HostelMessBilling> findByStatus(String status);
    Optional<HostelMessBilling> findByStudentIdAndBillingMonth(Long studentId, String billingMonth);
}
