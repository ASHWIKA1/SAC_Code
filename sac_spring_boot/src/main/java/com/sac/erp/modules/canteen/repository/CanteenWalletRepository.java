package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CanteenWalletRepository extends JpaRepository<CanteenWallet, Long> {
    Optional<CanteenWallet> findByStudentId(Long studentId);
    Optional<CanteenWallet> findByRfidCardUid(String rfid);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select w from CanteenWallet w where w.studentId = :studentId")
    Optional<CanteenWallet> findByStudentIdForUpdate(Long studentId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select w from CanteenWallet w where w.rfidCardUid = :rfid")
    Optional<CanteenWallet> findByRfidCardUidForUpdate(String rfid);
}
