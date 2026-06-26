package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long> {
}
