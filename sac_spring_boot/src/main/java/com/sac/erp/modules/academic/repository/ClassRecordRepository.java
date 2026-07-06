package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.ClassRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRecordRepository extends JpaRepository<ClassRecord, Long> {
    List<ClassRecord> findByActiveStatus(Integer activeStatus);
}
