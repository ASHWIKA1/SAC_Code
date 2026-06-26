package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.ClassSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassSectionRepository extends JpaRepository<ClassSection, Long> {
    List<ClassSection> findByClassRecord(ClassRecord classRecord);
}
