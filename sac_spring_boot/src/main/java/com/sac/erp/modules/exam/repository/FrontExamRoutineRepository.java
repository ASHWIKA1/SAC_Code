package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.FrontExamRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FrontExamRoutineRepository extends JpaRepository<FrontExamRoutine, Long> {
}
