package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.*;
import com.sac.erp.modules.dormitory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DormitoryServiceImpl implements DormitoryService {

    private final DormitoryListRepository dormitoryRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomListRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DormitoryList> getAllDormitories() {
        return dormitoryRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public DormitoryList createDormitory(DormitoryList dormitory) {
        return dormitoryRepository.save(dormitory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public RoomType createRoomType(RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomList> getAllRooms() {
        return roomRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomList> getRoomsByDormitory(Long dormitoryId) {
        return roomRepository.findByDormitoryIdAndActiveStatus(dormitoryId, 1);
    }

    @Override
    @Transactional
    public RoomList createRoom(RoomList room) {
        // Validate dormitory and room type
        dormitoryRepository.findById(room.getDormitoryId())
                .orElseThrow(() -> new RuntimeException("Dormitory not found"));
        roomTypeRepository.findById(room.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Room Type not found"));

        return roomRepository.save(room);
    }
}
