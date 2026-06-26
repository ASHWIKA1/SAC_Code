package com.sac.erp.modules.whatsapp.repository;

import com.sac.erp.modules.whatsapp.entity.WhatsappAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WhatsappAgentRepository extends JpaRepository<WhatsappAgent, Long> {
    List<WhatsappAgent> findByActiveStatus(Integer status);
}
