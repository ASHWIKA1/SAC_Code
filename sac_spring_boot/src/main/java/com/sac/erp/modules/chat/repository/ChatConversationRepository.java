package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    @Query("SELECT c FROM ChatConversation c WHERE (c.fromId = :user1 AND c.toId = :user2) OR (c.fromId = :user2 AND c.toId = :user1) ORDER BY c.createdAt ASC")
    List<ChatConversation> findDirectMessages(Long user1, Long user2);
}
