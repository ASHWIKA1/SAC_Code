package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatGroupMessageRemove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatGroupMessageRemoveRepository extends JpaRepository<ChatGroupMessageRemove, Long> {
}
