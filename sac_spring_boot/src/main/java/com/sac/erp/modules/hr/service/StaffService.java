package com.sac.erp.modules.hr.service;

import com.sac.erp.modules.hr.entity.Staff;
import java.util.List;

public interface StaffService {
    List<Staff> getAllStaffs();
    Staff getStaffById(Long id);
    Staff createStaff(Staff staff, Long designationId, Long departmentId);
}
