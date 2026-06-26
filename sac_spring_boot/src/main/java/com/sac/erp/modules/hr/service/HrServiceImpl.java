package com.sac.erp.modules.hr.service;

import com.sac.erp.entity.User;
import com.sac.erp.modules.hr.entity.LeaveDefine;
import com.sac.erp.modules.hr.entity.LeaveRequest;
import com.sac.erp.modules.hr.entity.LeaveType;
import com.sac.erp.modules.hr.entity.PayrollGenerate;
import com.sac.erp.modules.hr.entity.Staff;
import com.sac.erp.modules.hr.repository.LeaveDefineRepository;
import com.sac.erp.modules.hr.repository.LeaveRequestRepository;
import com.sac.erp.modules.hr.repository.LeaveTypeRepository;
import com.sac.erp.modules.hr.repository.PayrollGenerateRepository;
import com.sac.erp.modules.hr.repository.StaffRepository;
import com.sac.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HrServiceImpl implements HrService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveDefineRepository leaveDefineRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollGenerateRepository payrollGenerateRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LeaveType> getAllLeaveTypes() {
        return leaveTypeRepository.findAll();
    }

    @Override
    @Transactional
    public LeaveType createLeaveType(LeaveType leaveType) {
        return leaveTypeRepository.save(leaveType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveDefine> getAllLeaveDefinitions() {
        return leaveDefineRepository.findAll();
    }

    @Override
    @Transactional
    public LeaveDefine createLeaveDefine(LeaveDefine leaveDefine, Long leaveTypeId) {
        LeaveType leaveType = leaveTypeRepository.findById(leaveTypeId)
                .orElseThrow(() -> new RuntimeException("Leave Type not found"));
        leaveDefine.setLeaveType(leaveType);
        if (leaveDefine.getDays() != null) {
            leaveDefine.setTotalDays(leaveDefine.getDays());
        }
        return leaveDefineRepository.save(leaveDefine);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByStaff(Long userId) {
        return leaveRequestRepository.findByStaffId(userId);
    }

    @Override
    @Transactional
    public LeaveRequest applyLeave(LeaveRequest request, Long userId, Long leaveDefineId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LeaveDefine leaveDefine = leaveDefineRepository.findById(leaveDefineId)
                .orElseThrow(() -> new RuntimeException("Leave Definition not found"));

        long requestedDays = ChronoUnit.DAYS.between(request.getLeaveFrom(), request.getLeaveTo()) + 1;
        
        if (leaveDefine.getDays() != null && leaveDefine.getDays() < requestedDays) {
            throw new RuntimeException("Insufficient leave days left. Available: " + leaveDefine.getDays() + ", Requested: " + requestedDays);
        }

        request.setStaff(user);
        request.setLeaveDefine(leaveDefine);
        request.setLeaveType(leaveDefine.getLeaveType());
        request.setApproveStatus("P");
        request.setRoleId(user.getRole() != null ? user.getRole().getId() : null);

        return leaveRequestRepository.save(request);
    }

    @Override
    @Transactional
    public LeaveRequest approveLeave(Long leaveRequestId, String status, String note) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave Request not found"));

        if ("A".equalsIgnoreCase(status) && !"A".equalsIgnoreCase(leaveRequest.getApproveStatus())) {
            LeaveDefine leaveDefine = leaveRequest.getLeaveDefine();
            if (leaveDefine != null) {
                long requestedDays = ChronoUnit.DAYS.between(leaveRequest.getLeaveFrom(), leaveRequest.getLeaveTo()) + 1;
                if (leaveDefine.getDays() != null) {
                    if (leaveDefine.getDays() < requestedDays) {
                        throw new RuntimeException("Insufficient leave days left to approve this request.");
                    }
                    leaveDefine.setDays(leaveDefine.getDays() - (int) requestedDays);
                    leaveDefineRepository.save(leaveDefine);
                }
            }
        }

        leaveRequest.setApproveStatus(status);
        leaveRequest.setNote(note);
        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    @Transactional
    public PayrollGenerate generatePayroll(Long staffId, String month, String year) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff record not found"));

        boolean exists = payrollGenerateRepository.findByStaffIdAndPayrollMonthAndPayrollYear(staffId, month, year).isPresent();
        if (exists) {
            throw new RuntimeException("Payroll already generated for staff ID " + staffId + " for " + month + "/" + year);
        }

        double basic = 0.0;
        if (staff.getBasicSalary() != null) {
            try {
                basic = Double.parseDouble(staff.getBasicSalary());
            } catch (NumberFormatException e) {
                basic = 0.0;
            }
        }

        PayrollGenerate payroll = new PayrollGenerate();
        payroll.setStaff(staff);
        payroll.setBasicSalary(basic);
        payroll.setTotalEarning(0.0);
        payroll.setTotalDeduction(0.0);
        payroll.setGrossSalary(basic);
        payroll.setTax(0.0);
        payroll.setNetSalary(basic);
        payroll.setPayrollMonth(month);
        payroll.setPayrollYear(year);
        payroll.setPayrollStatus("G"); // G = generated
        payroll.setPaidAmount(0);
        payroll.setIsPartial(0);
        payroll.setSchoolId(staff.getSchoolId());

        return payrollGenerateRepository.save(payroll);
    }

    @Override
    @Transactional
    public PayrollGenerate payPayroll(Long payrollId, String paymentMode, String note) {
        PayrollGenerate payroll = payrollGenerateRepository.findById(payrollId)
                .orElseThrow(() -> new RuntimeException("Payroll record not found"));

        payroll.setPayrollStatus("P"); // P = paid
        payroll.setPaymentMode(paymentMode);
        payroll.setPaymentDate(LocalDate.now());
        payroll.setNote(note);
        payroll.setPaidAmount(payroll.getNetSalary() != null ? payroll.getNetSalary().intValue() : 0);

        return payrollGenerateRepository.save(payroll);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollGenerate> getPayrollByStaff(Long staffId) {
        return payrollGenerateRepository.findByStaffId(staffId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollGenerate> getPayrollHistory(String month, String year) {
        return payrollGenerateRepository.findByPayrollMonthAndPayrollYear(month, year);
    }
}
