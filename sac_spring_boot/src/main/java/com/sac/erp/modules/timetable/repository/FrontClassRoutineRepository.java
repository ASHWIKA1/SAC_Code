package com.sac.erp.modules.timetable.repository;

import com.sac.erp.modules.timetable.entity.FrontClassRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FrontClassRoutineRepository extends JpaRepository<FrontClassRoutine, Long> {
}
