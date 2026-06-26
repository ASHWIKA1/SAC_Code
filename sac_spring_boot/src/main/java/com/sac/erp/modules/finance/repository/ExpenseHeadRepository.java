package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.ExpenseHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseHeadRepository extends JpaRepository<ExpenseHead, Long> {
    List<ExpenseHead> findByActiveStatus(Integer activeStatus);
}
