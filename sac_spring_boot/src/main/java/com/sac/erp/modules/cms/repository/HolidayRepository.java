package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByActiveStatus(Integer activeStatus);
}
