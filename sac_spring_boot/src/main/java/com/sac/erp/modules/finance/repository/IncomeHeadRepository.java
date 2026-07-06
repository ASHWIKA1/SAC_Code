package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.IncomeHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncomeHeadRepository extends JpaRepository<IncomeHead, Long> {
    List<IncomeHead> findByActiveStatus(Integer activeStatus);
}
