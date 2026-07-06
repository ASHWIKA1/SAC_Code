package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.PhotoGallery;
import com.sac.erp.modules.cms.service.PhotoGalleryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms/photogallery")
@RequiredArgsConstructor
public class PhotoGalleryController {

    private final PhotoGalleryService service;

    @GetMapping
    public ResponseEntity<List<PhotoGallery>> getAll() {
        log.info("REST request to get all PhotoGallerys");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoGallery> getById(@PathVariable Long id) {
        log.info("REST request to get PhotoGallery : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PhotoGallery> create(@RequestBody PhotoGallery entity) {
        log.info("REST request to create PhotoGallery");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotoGallery> update(@PathVariable Long id, @RequestBody PhotoGallery entity) {
        log.info("REST request to update PhotoGallery : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete PhotoGallery : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
