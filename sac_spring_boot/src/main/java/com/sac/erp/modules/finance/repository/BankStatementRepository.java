package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.BankStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BankStatementRepository extends JpaRepository<BankStatement, Long> {
    List<BankStatement> findByActiveStatus(Integer activeStatus);
}
