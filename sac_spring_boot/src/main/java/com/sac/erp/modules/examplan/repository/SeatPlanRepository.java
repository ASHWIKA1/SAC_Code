package com.sac.erp.modules.examplan.repository;

import com.sac.erp.modules.examplan.entity.SeatPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatPlanRepository extends JpaRepository<SeatPlan, Long> {
    List<SeatPlan> findByExamTypeIdAndClassIdAndSectionId(Long examTypeId, Long classId, Long sectionId);
}
