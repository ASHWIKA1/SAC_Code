package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.*;
import java.util.List;

public interface DormitoryService {
    List<DormitoryList> getAllDormitories();
    DormitoryList createDormitory(DormitoryList dormitory);

    List<RoomType> getAllRoomTypes();
    RoomType createRoomType(RoomType roomType);

    List<RoomList> getAllRooms();
    List<RoomList> getRoomsByDormitory(Long dormitoryId);
    RoomList createRoom(RoomList room);
}
