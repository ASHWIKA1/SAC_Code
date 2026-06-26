package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.ChartOfAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChartOfAccountRepository extends JpaRepository<ChartOfAccount, Long> {
    List<ChartOfAccount> findByActiveStatus(Integer activeStatus);
    List<ChartOfAccount> findByTypeAndActiveStatus(String type, Integer activeStatus);
}
