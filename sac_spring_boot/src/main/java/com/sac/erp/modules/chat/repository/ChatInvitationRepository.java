package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatInvitationRepository extends JpaRepository<ChatInvitation, Long> {
    List<ChatInvitation> findByToAndStatus(Long to, Integer status);
}
