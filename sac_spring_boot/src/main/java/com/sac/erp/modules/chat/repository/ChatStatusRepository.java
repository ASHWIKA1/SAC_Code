package com.sac.erp.modules.chat.repository;

import com.sac.erp.modules.chat.entity.ChatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatStatusRepository extends JpaRepository<ChatStatus, Long> {
    Optional<ChatStatus> findByUserId(Long userId);
}
