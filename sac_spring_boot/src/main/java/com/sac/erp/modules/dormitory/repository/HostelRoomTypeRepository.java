package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.HostelRoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelRoomTypeRepository extends JpaRepository<HostelRoomType, Long> {
}
