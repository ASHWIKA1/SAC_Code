package com.sac.erp.modules.ai.repository;

import com.sac.erp.modules.ai.entity.AiTemplateContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AiTemplateContentRepository extends JpaRepository<AiTemplateContent, Long> {
    Optional<AiTemplateContent> findByTemplateId(Long templateId);
}
