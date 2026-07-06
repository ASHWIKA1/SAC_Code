package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.AmountTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AmountTransferRepository extends JpaRepository<AmountTransfer, Long> {
    List<AmountTransfer> findByActiveStatus(Integer activeStatus);
}
