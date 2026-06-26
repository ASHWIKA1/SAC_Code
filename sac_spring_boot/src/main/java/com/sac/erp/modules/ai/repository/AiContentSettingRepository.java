package com.sac.erp.modules.ai.repository;

import com.sac.erp.modules.ai.entity.AiContentSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AiContentSettingRepository extends JpaRepository<AiContentSetting, Long> {
    Optional<AiContentSetting> findFirstBy();
}
