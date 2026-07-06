package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatGroupMessageRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatGroupMessageRecipientRepository extends JpaRepository<ChatGroupMessageRecipient, Long> {
    List<ChatGroupMessageRecipient> findByConversationId(Long conversationId);
}
