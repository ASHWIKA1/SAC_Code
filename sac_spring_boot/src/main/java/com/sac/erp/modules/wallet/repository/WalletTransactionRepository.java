package com.sac.erp.modules.wallet.repository;

import com.sac.erp.modules.wallet.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByUserIdAndSchoolIdOrderByCreatedAtDesc(Long userId, String schoolId);

    List<WalletTransaction> findBySchoolIdOrderByCreatedAtDesc(String schoolId);

    @Query("SELECT COALESCE(SUM(CASE WHEN t.transactionType = 'CREDIT' THEN t.amount ELSE 0 END) - " +
           "SUM(CASE WHEN t.transactionType = 'DEBIT' THEN t.amount ELSE 0 END), 0) " +
           "FROM WalletTransaction t WHERE t.userId = :userId AND t.schoolId = :schoolId AND t.status = 'CONFIRMED'")
    BigDecimal getBalanceByUserIdAndSchoolId(Long userId, String schoolId);
}
