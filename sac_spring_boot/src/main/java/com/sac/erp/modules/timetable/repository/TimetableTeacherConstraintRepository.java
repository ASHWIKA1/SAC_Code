package com.sac.erp.modules.timetable.repository;

import com.sac.erp.modules.timetable.entity.TimetableTeacherConstraint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TimetableTeacherConstraintRepository extends JpaRepository<TimetableTeacherConstraint, Long> {
    Optional<TimetableTeacherConstraint> findByTeacherId(Long teacherId);
}
