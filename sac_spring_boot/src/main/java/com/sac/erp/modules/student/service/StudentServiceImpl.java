package com.sac.erp.modules.student.service;

import com.sac.erp.modules.core.entity.User;
import com.sac.erp.modules.academic.entity.ClassRecord;
import com.sac.erp.modules.academic.entity.Section;
import com.sac.erp.modules.academic.repository.ClassRecordRepository;
import com.sac.erp.modules.academic.repository.SectionRepository;
import com.sac.erp.modules.student.dto.StudentAdmissionDto;
import com.sac.erp.modules.student.entity.Parent;
import com.sac.erp.modules.student.entity.Student;
import com.sac.erp.modules.student.entity.StudentRecord;
import com.sac.erp.modules.student.repository.ParentRepository;
import com.sac.erp.modules.student.repository.StudentRepository;
import com.sac.erp.modules.student.repository.StudentRecordRepository;
import com.sac.erp.modules.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sac.erp.modules.canteen.repository.CanteenWalletRepository;
import com.sac.erp.modules.canteen.service.RealtimeEventPublisher;
import com.sac.erp.modules.canteen.entity.CanteenWallet;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final ClassRecordRepository classRepository;
    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final StudentRecordRepository studentRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final CanteenWalletRepository canteenWalletRepository;
    private final RealtimeEventPublisher realtimeEventPublisher;

    @Override
    @Transactional
    public Student admitStudent(StudentAdmissionDto dto) {
        log.info("Admitting student: {} {}", dto.getFirstName(), dto.getLastName());

        // 1. Verify Academic class/section parameters
        ClassRecord classRecord = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Section section = sectionRepository.findById(dto.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found"));

        // 2. Provision or resolve Parent profile
        Parent parent = parentRepository.findByFathersMobile(dto.getFathersMobile())
                .orElseGet(() -> {
                    log.info("Registering new parent: {}", dto.getFathersName());
                    
                    // Generate User credential for Parent portal
                    User parentUser = new User();
                    parentUser.setName(dto.getFathersName());
                    parentUser.setEmail(dto.getFathersMobile() + "@sacgotek.com");
                    parentUser.setUsername("parent_" + dto.getFathersMobile());
                    parentUser.setPassword(passwordEncoder.encode("password"));
                    parentUser.setPhone(dto.getFathersMobile());
                    parentUser.setActiveStatus(1);
                    User savedUser = userRepository.save(parentUser);

                    Parent newParent = new Parent();
                    newParent.setFathersName(dto.getFathersName());
                    newParent.setFathersMobile(dto.getFathersMobile());
                    newParent.setFathersOccupation(dto.getFathersOccupation());
                    newParent.setMothersName(dto.getMothersName());
                    newParent.setGuardiansName(dto.getGuardiansName());
                    newParent.setGuardiansMobile(dto.getGuardiansMobile());
                    newParent.setGuardiansRelation(dto.getGuardiansRelation());
                    newParent.setUser(savedUser);
                    newParent.setActiveStatus(1);
                    return parentRepository.save(newParent);
                });

        // 3. Create Student User credentials
        User studentUser = new User();
        studentUser.setName(dto.getFirstName() + " " + (dto.getLastName() != null ? dto.getLastName() : ""));
        studentUser.setEmail(dto.getEmail() != null ? dto.getEmail() : dto.getAdmissionNo() + "@sacgotek.com");
        studentUser.setUsername(dto.getAdmissionNo());
        studentUser.setPassword(passwordEncoder.encode("password"));
        studentUser.setPhone(dto.getMobile());
        studentUser.setActiveStatus(1);
        User savedStudentUser = userRepository.save(studentUser);

        // 4. Save Student
        Student student = new Student();
        student.setUser(savedStudentUser);
        student.setAdmissionNo(dto.getAdmissionNo());
        student.setRollNo(dto.getRollNo());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setMobile(dto.getMobile());
        student.setEmail(dto.getEmail());
        student.setClassId(dto.getClassId());
        student.setSectionId(dto.getSectionId());
        student.setParentId(parent.getId());
        student.setActiveStatus(1);
        Student savedStudent = studentRepository.save(student);

        // 5. Instantiates class record registration mapping
        StudentRecord record = new StudentRecord();
        record.setClassRecord(classRecord);
        record.setSection(section);
        record.setStudent(savedStudent);
        record.setRollNo(dto.getRollNo() != null ? dto.getRollNo().toString() : "");
        record.setIsDefault(true);
        record.setActiveStatus(1);
        studentRecordRepository.save(record);

        return savedStudent;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getStudentsByClassAndSection(Long classId, Long sectionId) {
        log.info("Fetching class-scoped student registers for Class {} Section {}", classId, sectionId);
        // Look up by student record mappings
        return studentRecordRepository.findByClassRecord_IdAndSection_Id(classId, sectionId).stream()
                .map(StudentRecord::getStudent)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Override
    @Transactional
    public Student toggleStudentSuspension(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        int nextStatus = student.getActiveStatus() == 1 ? 0 : 1;
        student.setActiveStatus(nextStatus);
        
        // Also update CanteenWallet isActive status in real-time
        canteenWalletRepository.findByStudentId(id).ifPresent(wallet -> {
            wallet.setIsActive(nextStatus);
            canteenWalletRepository.save(wallet);
            realtimeEventPublisher.publish("WALLET_UPDATE", wallet);
        });

        Student saved = studentRepository.save(student);
        
        // Emit cross-module SSE event
        String eventType = nextStatus == 1 ? "STUDENT_ACTIVATED" : "STUDENT_SUSPENDED";
        realtimeEventPublisher.publish(eventType, saved);
        realtimeEventPublisher.publish("SYSTEM_NOTIFICATION", 
            String.format("[STUDENT-INFO -> VENDOR] Student %s (#%d) status changed to %s. Canteen wallet synced.", 
                student.getFullName(), student.getId(), nextStatus == 1 ? "Active" : "Suspended"));
        
        return saved;
    }
}
