package com.sac.erp.modules.library.controller;

import com.sac.erp.modules.library.entity.BookCategory;
import com.sac.erp.modules.library.service.BookCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/library/bookcategory")
@RequiredArgsConstructor
public class BookCategoryController {

    private final BookCategoryService service;

    @GetMapping
    public ResponseEntity<List<BookCategory>> getAll() {
        log.info("REST request to get all BookCategorys");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCategory> getById(@PathVariable Long id) {
        log.info("REST request to get BookCategory : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookCategory> create(@RequestBody BookCategory entity) {
        log.info("REST request to create BookCategory");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookCategory> update(@PathVariable Long id, @RequestBody BookCategory entity) {
        log.info("REST request to update BookCategory : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete BookCategory : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
