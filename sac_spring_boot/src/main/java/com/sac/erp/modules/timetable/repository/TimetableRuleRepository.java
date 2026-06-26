package com.sac.erp.modules.timetable.repository;

import com.sac.erp.modules.timetable.entity.TimetableRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimetableRuleRepository extends JpaRepository<TimetableRule, Long> {
    List<TimetableRule> findByClassIdAndSectionId(Long classId, Long sectionId);
}
