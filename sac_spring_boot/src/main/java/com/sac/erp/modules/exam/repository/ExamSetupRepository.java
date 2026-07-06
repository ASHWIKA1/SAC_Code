package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.ExamSetup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamSetupRepository extends JpaRepository<ExamSetup, Long> {
    List<ExamSetup> findByClassRecord_IdAndSection_IdAndExamTerm_Id(Long classId, Long sectionId, Long examTermId);
}
