package com.sac.erp.modules.dormitory.controller;

import com.sac.erp.modules.dormitory.entity.HostelRoom;
import com.sac.erp.modules.dormitory.service.HostelRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/dormitory/hostelroom")
@RequiredArgsConstructor
public class HostelRoomController {

    private final HostelRoomService service;

    @GetMapping
    public ResponseEntity<List<HostelRoom>> getAll() {
        log.info("REST request to get all HostelRooms");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelRoom> getById(@PathVariable Long id) {
        log.info("REST request to get HostelRoom : {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<HostelRoom> create(@RequestBody HostelRoom entity) {
        log.info("REST request to create HostelRoom");
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelRoom> update(@PathVariable Long id, @RequestBody HostelRoom entity) {
        log.info("REST request to update HostelRoom : {}", id);
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete HostelRoom : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
