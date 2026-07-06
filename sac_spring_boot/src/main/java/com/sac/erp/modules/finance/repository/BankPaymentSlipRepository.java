package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.BankPaymentSlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BankPaymentSlipRepository extends JpaRepository<BankPaymentSlip, Long> {
    List<BankPaymentSlip> findByActiveStatus(Integer activeStatus);
}
