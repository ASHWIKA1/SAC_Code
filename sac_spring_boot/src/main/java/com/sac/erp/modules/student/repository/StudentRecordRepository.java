package com.sac.erp.modules.student.repository;

import com.sac.erp.modules.student.entity.StudentRecord;
import com.sac.erp.modules.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRecordRepository extends JpaRepository<StudentRecord, Long> {
    List<StudentRecord> findByStudent(Student student);
    List<StudentRecord> findByClassRecord_IdAndSection_Id(Long classId, Long sectionId);
}
