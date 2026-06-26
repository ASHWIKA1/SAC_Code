package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.ContactPage;
import com.sac.erp.modules.cms.service.ContactPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/contactpage")
@RequiredArgsConstructor
public class ContactPageController {

    private final ContactPageService service;

    @GetMapping
    public ResponseEntity<List<ContactPage>> getAll() {
        log.info("REST request to get all ContactPages");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactPage> getById(@PathVariable Long id) {
        log.info("REST request to get ContactPage : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ContactPage> create(@RequestBody ContactPage entity) {
        log.info("REST request to create ContactPage");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactPage> update(@PathVariable Long id, @RequestBody ContactPage entity) {
        log.info("REST request to update ContactPage : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete ContactPage : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
