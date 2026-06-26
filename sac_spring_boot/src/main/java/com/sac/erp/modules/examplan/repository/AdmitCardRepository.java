package com.sac.erp.modules.examplan.repository;

import com.sac.erp.modules.examplan.entity.AdmitCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdmitCardRepository extends JpaRepository<AdmitCard, Long> {
    List<AdmitCard> findByExamTypeIdAndClassIdAndSectionId(Long examTypeId, Long classId, Long sectionId);
    List<AdmitCard> findByStudentRecordId(Long studentRecordId);
}
