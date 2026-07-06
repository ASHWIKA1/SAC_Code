package com.sac.erp.modules.timetable.repository;

import com.sac.erp.modules.timetable.entity.ClassRoutineUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassRoutineUpdateRepository extends JpaRepository<ClassRoutineUpdate, Long> {
    List<ClassRoutineUpdate> findByClassIdAndSectionId(Long classId, Long sectionId);
    List<ClassRoutineUpdate> findByTeacherIdAndDay(Long teacherId, Integer day);
}
