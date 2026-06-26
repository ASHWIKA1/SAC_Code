package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.MarkStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkStoreRepository extends JpaRepository<MarkStore, Long> {
    List<MarkStore> findByStudent_IdAndClassRecord_IdAndSection_Id(Long studentId, Long classId, Long sectionId);
    List<MarkStore> findByExamTerm_IdAndClassRecord_IdAndSection_Id(Long examTermId, Long classId, Long sectionId);
}
