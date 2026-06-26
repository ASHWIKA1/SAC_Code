package com.sac.erp.modules.whatsapp.repository;

import com.sac.erp.modules.whatsapp.entity.WhatsappAgentTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WhatsappAgentTimeRepository extends JpaRepository<WhatsappAgentTime, Long> {
    List<WhatsappAgentTime> findByAgentId(Long agentId);
}
