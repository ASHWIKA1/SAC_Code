package com.sac.erp.modules.whatsapp.repository;

import com.sac.erp.modules.whatsapp.entity.WhatsappSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WhatsappSettingRepository extends JpaRepository<WhatsappSetting, Long> {
    Optional<WhatsappSetting> findFirstBy();
}
