package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByActiveStatus(Integer activeStatus);
}
