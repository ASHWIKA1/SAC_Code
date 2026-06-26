package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatGroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatGroupUserRepository extends JpaRepository<ChatGroupUser, Long> {
    List<ChatGroupUser> findByGroupId(String groupId);
    List<ChatGroupUser> findByUserId(Long userId);
}
