package com.sac.erp.modules.finance.controller;

import com.sac.erp.modules.finance.entity.AmountTransfer;
import com.sac.erp.modules.finance.service.AmountTransferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/finance/amounttransfer")
@RequiredArgsConstructor
public class AmountTransferController {

    private final AmountTransferService service;

    @GetMapping
    public ResponseEntity<List<AmountTransfer>> getAll() {
        log.info("REST request to get all AmountTransfers");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmountTransfer> getById(@PathVariable Long id) {
        log.info("REST request to get AmountTransfer : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<AmountTransfer> create(@RequestBody AmountTransfer entity) {
        log.info("REST request to create AmountTransfer");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmountTransfer> update(@PathVariable Long id, @RequestBody AmountTransfer entity) {
        log.info("REST request to update AmountTransfer : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete AmountTransfer : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
