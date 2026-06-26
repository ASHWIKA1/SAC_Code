package com.sac.erp.modules.canteen.controller;

import com.sac.erp.modules.canteen.entity.CanteenWallet;
import com.sac.erp.modules.canteen.service.CanteenWalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/canteen/canteenwallet")
@RequiredArgsConstructor
public class CanteenWalletController {

    private final CanteenWalletService service;

    @GetMapping
    public ResponseEntity<List<CanteenWallet>> getAll() {
        log.info("REST request to get all CanteenWallets");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CanteenWallet> getById(@PathVariable Long id) {
        log.info("REST request to get CanteenWallet : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CanteenWallet> create(@RequestBody CanteenWallet entity) {
        log.info("REST request to create CanteenWallet");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CanteenWallet> update(@PathVariable Long id, @RequestBody CanteenWallet entity) {
        log.info("REST request to update CanteenWallet : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete CanteenWallet : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
