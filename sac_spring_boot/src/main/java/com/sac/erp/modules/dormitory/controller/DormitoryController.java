package com.sac.erp.modules.dormitory.controller;

import com.sac.erp.modules.dormitory.entity.*;
import com.sac.erp.modules.dormitory.service.DormitoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/dormitory")
@RequiredArgsConstructor
public class DormitoryController {

    private final DormitoryService dormitoryService;

    @GetMapping
    public ResponseEntity<List<DormitoryList>> getDormitories() {
        log.info("REST request to get all active dormitories");
        return ResponseEntity.ok(dormitoryService.getAllDormitories());
    }

    @PostMapping
    public ResponseEntity<DormitoryList> createDormitory(@RequestBody DormitoryList dormitory) {
        log.info("REST request to configure dormitory: {}", dormitory.getDormitoryName());
        return ResponseEntity.ok(dormitoryService.createDormitory(dormitory));
    }

    @GetMapping("/room-types")
    public ResponseEntity<List<RoomType>> getRoomTypes() {
        log.info("REST request to get active room types");
        return ResponseEntity.ok(dormitoryService.getAllRoomTypes());
    }

    @PostMapping("/room-types")
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        log.info("REST request to configure room type: {}", roomType.getType());
        return ResponseEntity.ok(dormitoryService.createRoomType(roomType));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomList>> getRooms() {
        log.info("REST request to get active rooms list");
        return ResponseEntity.ok(dormitoryService.getAllRooms());
    }

    @GetMapping("/rooms/dormitory/{dormitoryId}")
    public ResponseEntity<List<RoomList>> getRoomsByDormitory(@PathVariable Long dormitoryId) {
        log.info("REST request to get rooms in dormitory: {}", dormitoryId);
        return ResponseEntity.ok(dormitoryService.getRoomsByDormitory(dormitoryId));
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomList> createRoom(@RequestBody RoomList room) {
        log.info("REST request to define room: {}", room.getRoomNo());
        return ResponseEntity.ok(dormitoryService.createRoom(room));
    }
}
