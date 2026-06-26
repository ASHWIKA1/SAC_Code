package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanteenTransactionRepository extends JpaRepository<CanteenTransaction, Long> {
    List<CanteenTransaction> findByStudentId(Long studentId);
    List<CanteenTransaction> findByWalletId(Long walletId);
}
