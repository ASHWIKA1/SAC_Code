package com.sac.erp.modules.attendance.service;

import com.sac.erp.modules.attendance.dto.BulkStudentAttendanceDto;
import com.sac.erp.modules.attendance.entity.StudentAttendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    void saveStudentAttendance(BulkStudentAttendanceDto dto);
    List<StudentAttendance> getStudentAttendanceReport(LocalDate date, Long classId, Long sectionId);
}
