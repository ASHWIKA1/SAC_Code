package com.sac.erp.modules.academic.controller;

import com.sac.erp.modules.academic.dto.SectionDto;
import com.sac.erp.modules.academic.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/academics/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @GetMapping
    public ResponseEntity<List<SectionDto>> getAllSections() {
        log.info("REST request to get all Sections");
        return ResponseEntity.ok(sectionService.getAllSections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionDto> getSectionById(@PathVariable Long id) {
        log.info("REST request to get Section : {}", id);
        return ResponseEntity.ok(sectionService.getSectionById(id));
    }

    @PostMapping
    public ResponseEntity<SectionDto> createSection(@Valid @RequestBody SectionDto dto) {
        log.info("REST request to create Section: {}", dto.getSectionName());
        return ResponseEntity.ok(sectionService.createSection(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SectionDto> updateSection(@PathVariable Long id, @Valid @RequestBody SectionDto dto) {
        log.info("REST request to update Section : {}", id);
        return ResponseEntity.ok(sectionService.updateSection(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        log.info("REST request to delete Section : {}", id);
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
