package com.sac.erp.modules.ai.repository;

import com.sac.erp.modules.ai.entity.AiGeneratedContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiGeneratedContentRepository extends JpaRepository<AiGeneratedContent, Long> {
    List<AiGeneratedContent> findByTemplateId(Long templateId);
}
