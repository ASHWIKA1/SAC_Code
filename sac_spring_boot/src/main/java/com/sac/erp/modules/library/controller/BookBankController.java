package com.sac.erp.modules.library.controller;

import com.sac.erp.modules.library.entity.BookBank;
import com.sac.erp.modules.library.service.BookBankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/library/bookbank")
@RequiredArgsConstructor
public class BookBankController {

    private final BookBankService service;

    @GetMapping
    public ResponseEntity<List<BookBank>> getAll() {
        log.info("REST request to get all BookBanks");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookBank> getById(@PathVariable Long id) {
        log.info("REST request to get BookBank : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookBank> create(@RequestBody BookBank entity) {
        log.info("REST request to create BookBank");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookBank> update(@PathVariable Long id, @RequestBody BookBank entity) {
        log.info("REST request to update BookBank : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete BookBank : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
