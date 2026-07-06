package com.sac.erp.modules.hr.service;

import com.sac.erp.modules.hr.entity.LeaveDefine;
import com.sac.erp.modules.hr.entity.LeaveRequest;
import com.sac.erp.modules.hr.entity.LeaveType;
import com.sac.erp.modules.hr.entity.PayrollGenerate;

import java.util.List;

public interface HrService {
    // Leave Type
    List<LeaveType> getAllLeaveTypes();
    LeaveType createLeaveType(LeaveType leaveType);

    // Leave Define
    List<LeaveDefine> getAllLeaveDefinitions();
    LeaveDefine createLeaveDefine(LeaveDefine leaveDefine, Long leaveTypeId);

    // Leave Request
    List<LeaveRequest> getAllLeaveRequests();
    List<LeaveRequest> getLeaveRequestsByStaff(Long userId);
    LeaveRequest applyLeave(LeaveRequest request, Long userId, Long leaveDefineId);
    LeaveRequest approveLeave(Long leaveRequestId, String status, String note);

    // Payroll
    PayrollGenerate generatePayroll(Long staffId, String month, String year);
    PayrollGenerate payPayroll(Long payrollId, String paymentMode, String note);
    List<PayrollGenerate> getPayrollByStaff(Long staffId);
    List<PayrollGenerate> getPayrollHistory(String month, String year);
}
