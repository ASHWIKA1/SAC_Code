package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByActiveStatus(Integer activeStatus);
}
