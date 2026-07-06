package com.sac.erp.modules.ai.service;

import com.sac.erp.modules.ai.entity.*;
import com.sac.erp.modules.ai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiContentService {

    private final AiTemplateRepository templateRepository;
    private final AiTemplateContentRepository templateContentRepository;
    private final AiGeneratedContentRepository generatedContentRepository;
    private final AiContentSettingRepository settingRepository;

    @Transactional(readOnly = true)
    public List<AiTemplate> getAllTemplates() {
        return templateRepository.findByStatus(1);
    }

    @Transactional
    public AiTemplate createTemplate(AiTemplate template) {
        return templateRepository.save(template);
    }

    @Transactional
    public AiTemplate updateTemplate(Long id, AiTemplate updated) {
        AiTemplate t = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AI Template not found: " + id));
        t.setName(updated.getName());
        t.setSlug(updated.getSlug());
        t.setIcon(updated.getIcon());
        t.setType(updated.getType());
        t.setStatus(updated.getStatus());
        return templateRepository.save(t);
    }

    @Transactional
    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }

    @Transactional
    public AiTemplateContent saveTemplateContent(AiTemplateContent content) {
        return templateContentRepository.save(content);
    }

    @Transactional(readOnly = true)
    public List<AiGeneratedContent> getGeneratedContents() {
        return generatedContentRepository.findAll();
    }

    @Transactional
    public AiGeneratedContent saveGeneratedContent(AiGeneratedContent content) {
        log.info("Saving AI generated content for template: {}", content.getTemplateId());
        return generatedContentRepository.save(content);
    }

    @Transactional
    public void deleteGeneratedContent(Long id) {
        generatedContentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public AiContentSetting getSettings() {
        return settingRepository.findFirstBy().orElse(new AiContentSetting());
    }

    @Transactional
    public AiContentSetting saveSettings(AiContentSetting setting) {
        return settingRepository.save(setting);
    }
}
