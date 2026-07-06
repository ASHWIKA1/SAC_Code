package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.entity.AssignSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignSubjectRepository extends JpaRepository<AssignSubject, Long> {
    List<AssignSubject> findByClassRecordAndSection(ClassRecord classRecord, Section section);
}
