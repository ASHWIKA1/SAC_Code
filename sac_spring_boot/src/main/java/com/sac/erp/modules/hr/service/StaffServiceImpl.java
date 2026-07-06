package com.sac.erp.modules.hr.service;

import com.sac.erp.modules.hr.entity.Department;
import com.sac.erp.modules.hr.entity.Designation;
import com.sac.erp.modules.hr.entity.Staff;
import com.sac.erp.modules.hr.repository.DepartmentRepository;
import com.sac.erp.modules.hr.repository.DesignationRepository;
import com.sac.erp.modules.hr.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final DesignationRepository designationRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Staff> getAllStaffs() {
        return staffRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff record not found"));
    }

    @Override
    @Transactional
    public Staff createStaff(Staff staff, Long designationId, Long departmentId) {
        if (designationId != null) {
            Designation designation = designationRepository.findById(designationId)
                    .orElseThrow(() -> new RuntimeException("Designation not found"));
            staff.setDesignation(designation);
        }
        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            staff.setDepartment(department);
        }
        return staffRepository.save(staff);
    }
}
