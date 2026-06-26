package com.sac.erp.modules.timetable.repository;

import com.sac.erp.modules.timetable.entity.ClassRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassRoutineRepository extends JpaRepository<ClassRoutine, Long> {
    List<ClassRoutine> findByClassIdAndSectionId(Long classId, Long sectionId);
}
