package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatBlockUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatBlockUserRepository extends JpaRepository<ChatBlockUser, Long> {
    List<ChatBlockUser> findByBlockBy(Long blockBy);
    boolean existsByBlockByAndBlockTo(Long blockBy, Long blockTo);
}
