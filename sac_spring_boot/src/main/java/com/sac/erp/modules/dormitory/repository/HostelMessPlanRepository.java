package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.HostelMessPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelMessPlanRepository extends JpaRepository<HostelMessPlan, Long> {
    List<HostelMessPlan> findByHostelId(Long hostelId);
    List<HostelMessPlan> findByHostelIdAndDayOfWeek(Long hostelId, String dayOfWeek);
}
