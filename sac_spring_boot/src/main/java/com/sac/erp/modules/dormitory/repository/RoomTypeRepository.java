package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    List<RoomType> findByActiveStatus(Integer activeStatus);
}
