package com.sac.erp.modules.attendance.service;

import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import com.sac.erp.modules.academic.repository.SectionRepository;
import com.sac.erp.modules.attendance.dto.BulkStudentAttendanceDto;
import com.sac.erp.modules.attendance.dto.StudentAttendanceDto;
import com.sac.erp.modules.attendance.entity.StudentAttendance;
import com.sac.erp.modules.attendance.repository.StudentAttendanceRepository;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.entity.StudentRecord;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.modules.student.repository.StudentRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final StudentAttendanceRepository attendanceRepository;
    private final ClassRecordRepository classRepository;
    private final SectionRepository sectionRepository;
    private final StudentRepository studentRepository;
    private final StudentRecordRepository studentRecordRepository;

    @Override
    @Transactional
    public void saveStudentAttendance(BulkStudentAttendanceDto dto) {
        log.info("Saving student attendance for Date: {}, Class: {}, Section: {}", 
                dto.getAttendanceDate(), dto.getClassId(), dto.getSectionId());

        ClassRecord classRecord = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Section section = sectionRepository.findById(dto.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found"));

        // Preload current attendance records for this date/class/section
        List<StudentAttendance> existing = attendanceRepository
                .findByAttendanceDateAndClassRecord_IdAndSection_Id(dto.getAttendanceDate(), dto.getClassId(), dto.getSectionId());

        for (StudentAttendanceDto attendanceDto : dto.getAttendances()) {
            Student student = studentRepository.findById(attendanceDto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Look up corresponding student enrollment record
            StudentRecord record = studentRecordRepository.findByStudent(student).stream()
                    .filter(r -> r.getClassRecord().getId().equals(dto.getClassId()) 
                            && r.getSection().getId().equals(dto.getSectionId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Student enrollment record not found"));

            // Check if attendance already exists
            Optional<StudentAttendance> match = existing.stream()
                    .filter(a -> a.getStudent().getId().equals(student.getId()))
                    .findFirst();

            StudentAttendance attendance;
            if (match.isPresent()) {
                attendance = match.get();
            } else {
                attendance = new StudentAttendance();
                attendance.setStudent(student);
                attendance.setStudentRecord(record);
                attendance.setClassRecord(classRecord);
                attendance.setSection(section);
                attendance.setAttendanceDate(dto.getAttendanceDate());
            }

            attendance.setAttendanceType(attendanceDto.getAttendanceType());
            attendance.setNotes(attendanceDto.getNotes());
            attendance.setAcademicId(dto.getAcademicId());
            attendance.setActiveStatus(1);

            attendanceRepository.save(attendance);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAttendance> getStudentAttendanceReport(LocalDate date, Long classId, Long sectionId) {
        log.info("Retrieving student attendance report for Date: {}, Class: {}, Section: {}", date, classId, sectionId);
        return attendanceRepository.findByAttendanceDateAndClassRecord_IdAndSection_Id(date, classId, sectionId);
    }
}
