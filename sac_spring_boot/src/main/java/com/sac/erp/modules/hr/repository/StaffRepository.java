package com.sac.erp.modules.hr.repository;

import com.sac.erp.modules.hr.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByActiveStatus(Integer activeStatus);
    java.util.Optional<Staff> findByUserId(Long userId);
}
