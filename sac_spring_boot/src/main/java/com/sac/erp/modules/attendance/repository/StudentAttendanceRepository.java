package com.sac.erp.modules.attendance.repository;

import com.sac.erp.modules.attendance.entity.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {
    List<StudentAttendance> findByAttendanceDateAndClassRecord_IdAndSection_Id(LocalDate date, Long classId, Long sectionId);
}
