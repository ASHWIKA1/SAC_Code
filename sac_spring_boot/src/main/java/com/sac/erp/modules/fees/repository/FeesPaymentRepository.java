package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesPaymentRepository extends JpaRepository<FeesPayment, Long> {
    List<FeesPayment> findByStudentId(Long studentId);
    List<FeesPayment> findByFeesTypeId(Long feesTypeId);
}
