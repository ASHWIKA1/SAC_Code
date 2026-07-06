package com.sac.erp.modules.ai.controller;

import com.sac.erp.modules.ai.entity.*;
import com.sac.erp.modules.ai.service.AiContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Content", description = "AI Content Generation APIs")
public class AiContentController {

    private final AiContentService aiContentService;

    @GetMapping("/templates")
    @Operation(summary = "Get all active AI templates")
    public ResponseEntity<List<AiTemplate>> getTemplates() {
        return ResponseEntity.ok(aiContentService.getAllTemplates());
    }

    @PostMapping("/templates")
    @Operation(summary = "Create an AI template")
    public ResponseEntity<AiTemplate> createTemplate(@RequestBody AiTemplate template) {
        return ResponseEntity.ok(aiContentService.createTemplate(template));
    }

    @PutMapping("/templates/{id}")
    @Operation(summary = "Update an AI template")
    public ResponseEntity<AiTemplate> updateTemplate(@PathVariable Long id, @RequestBody AiTemplate template) {
        return ResponseEntity.ok(aiContentService.updateTemplate(id, template));
    }

    @DeleteMapping("/templates/{id}")
    @Operation(summary = "Delete an AI template")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        aiContentService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/templates/content")
    @Operation(summary = "Save AI template content (prompt structure)")
    public ResponseEntity<AiTemplateContent> saveTemplateContent(@RequestBody AiTemplateContent content) {
        return ResponseEntity.ok(aiContentService.saveTemplateContent(content));
    }

    @GetMapping("/generated")
    @Operation(summary = "Get all AI generated content records")
    public ResponseEntity<List<AiGeneratedContent>> getGeneratedContents() {
        return ResponseEntity.ok(aiContentService.getGeneratedContents());
    }

    @PostMapping("/generate")
    @Operation(summary = "Save a new AI generated content record")
    public ResponseEntity<AiGeneratedContent> generateContent(@RequestBody AiGeneratedContent content) {
        return ResponseEntity.ok(aiContentService.saveGeneratedContent(content));
    }

    @DeleteMapping("/generated/{id}")
    @Operation(summary = "Delete AI generated content")
    public ResponseEntity<Void> deleteGenerated(@PathVariable Long id) {
        aiContentService.deleteGeneratedContent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/settings")
    @Operation(summary = "Get AI content settings (OpenAI key, model, etc.)")
    public ResponseEntity<AiContentSetting> getSettings() {
        return ResponseEntity.ok(aiContentService.getSettings());
    }

    @PostMapping("/settings")
    @Operation(summary = "Save AI content settings")
    public ResponseEntity<AiContentSetting> saveSettings(@RequestBody AiContentSetting setting) {
        return ResponseEntity.ok(aiContentService.saveSettings(setting));
    }
}
