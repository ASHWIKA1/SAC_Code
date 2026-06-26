package com.sac.erp.modules.whatsapp.repository;

import com.sac.erp.modules.whatsapp.entity.WhatsappMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WhatsappMessageRepository extends JpaRepository<WhatsappMessage, Long> {
    List<WhatsappMessage> findByAgentId(Long agentId);
    List<WhatsappMessage> findBySender(String sender);
}
