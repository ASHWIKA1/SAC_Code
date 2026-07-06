package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatInvitationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatInvitationTypeRepository extends JpaRepository<ChatInvitationType, Long> {
}
