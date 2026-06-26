package com.sac.erp.modules.wallet.repository;

import com.sac.erp.modules.wallet.entity.WalletSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletSettingRepository extends JpaRepository<WalletSetting, Long> {

    Optional<WalletSetting> findBySchoolId(String schoolId);
}
