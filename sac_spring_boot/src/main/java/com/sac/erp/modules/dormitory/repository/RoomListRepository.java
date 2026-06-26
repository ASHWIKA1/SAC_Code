package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.RoomList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomListRepository extends JpaRepository<RoomList, Long> {
    List<RoomList> findByActiveStatus(Integer activeStatus);
    List<RoomList> findByDormitoryIdAndActiveStatus(Long dormitoryId, Integer activeStatus);
}
