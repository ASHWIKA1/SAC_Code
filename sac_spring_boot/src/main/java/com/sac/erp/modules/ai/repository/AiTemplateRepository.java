package com.sac.erp.modules.ai.repository;

import com.sac.erp.modules.ai.entity.AiTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiTemplateRepository extends JpaRepository<AiTemplate, Long> {
    List<AiTemplate> findByStatus(Integer status);
}
