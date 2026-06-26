package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.MarksGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarksGradeRepository extends JpaRepository<MarksGrade, Long> {

    @Query("SELECT mg FROM MarksGrade mg WHERE :percentage BETWEEN mg.percentFrom AND mg.percentUpto")
    Optional<MarksGrade> findGradeByPercentage(@Param("percentage") Double percentage);
}
