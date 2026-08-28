package com.sac.erp;

import com.sac.erp.modules.core.entity.Role;
import com.sac.erp.modules.core.entity.User;
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
import com.sac.erp.modules.hr.service.HrServiceImpl;
import com.sac.erp.modules.core.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class HrServiceTest {

    @Mock
    private LeaveTypeRepository leaveTypeRepository;
    @Mock
    private LeaveDefineRepository leaveDefineRepository;
    @Mock
    private LeaveRequestRepository leaveRequestRepository;
    @Mock
    private PayrollGenerateRepository payrollGenerateRepository;
    @Mock
    private StaffRepository staffRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HrServiceImpl hrService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testApplyLeave_Success() {
        User user = new User();
        user.setId(1L);
        Role role = new Role();
        role.setId(2L);
        user.setRole(role);

        LeaveType leaveType = new LeaveType();
        leaveType.setId(1L);

        LeaveDefine leaveDefine = new LeaveDefine();
        leaveDefine.setId(1L);
        leaveDefine.setDays(10);
        leaveDefine.setLeaveType(leaveType);

        LeaveRequest request = new LeaveRequest();
        request.setLeaveFrom(LocalDate.of(2026, 6, 1));
        request.setLeaveTo(LocalDate.of(2026, 6, 5)); // 5 days requested

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(leaveDefineRepository.findById(1L)).thenReturn(Optional.of(leaveDefine));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LeaveRequest savedRequest = hrService.applyLeave(request, 1L, 1L);

        assertNotNull(savedRequest);
        assertEquals("P", savedRequest.getApproveStatus());
        assertEquals(2L, savedRequest.getRoleId());
        assertEquals(user, savedRequest.getStaff());
    }

    @Test
    void testApplyLeave_InsufficientDays() {
        User user = new User();
        user.setId(1L);

        LeaveDefine leaveDefine = new LeaveDefine();
        leaveDefine.setId(1L);
        leaveDefine.setDays(2); // Only 2 days left

        LeaveRequest request = new LeaveRequest();
        request.setLeaveFrom(LocalDate.of(2026, 6, 1));
        request.setLeaveTo(LocalDate.of(2026, 6, 5)); // 5 days requested

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(leaveDefineRepository.findById(1L)).thenReturn(Optional.of(leaveDefine));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            hrService.applyLeave(request, 1L, 1L);
        });

        assertTrue(exception.getMessage().contains("Insufficient leave days left"));
    }

    @Test
    void testApproveLeave_DeductDays() {
        LeaveDefine leaveDefine = new LeaveDefine();
        leaveDefine.setId(1L);
        leaveDefine.setDays(10);

        LeaveRequest request = new LeaveRequest();
        request.setId(1L);
        request.setApproveStatus("P");
        request.setLeaveFrom(LocalDate.of(2026, 6, 1));
        request.setLeaveTo(LocalDate.of(2026, 6, 3)); // 3 days requested
        request.setLeaveDefine(leaveDefine);

        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(request));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(leaveDefineRepository.save(any(LeaveDefine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LeaveRequest approvedRequest = hrService.approveLeave(1L, "A", "Approved by Principal");

        assertNotNull(approvedRequest);
        assertEquals("A", approvedRequest.getApproveStatus());
        assertEquals(7, leaveDefine.getDays()); // 10 - 3 = 7 days left
        verify(leaveDefineRepository, times(1)).save(leaveDefine);
    }

    @Test
    void testGeneratePayroll_Success() {
        Staff staff = new Staff();
        staff.setId(1L);
        staff.setBasicSalary("5000.00");
        staff.setSchoolId("1");

        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(payrollGenerateRepository.findByStaffIdAndPayrollMonthAndPayrollYear(1L, "June", "2026"))
                .thenReturn(Optional.empty());
        when(payrollGenerateRepository.save(any(PayrollGenerate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PayrollGenerate payroll = hrService.generatePayroll(1L, "June", "2026");

        assertNotNull(payroll);
        assertEquals(5000.00, payroll.getBasicSalary());
        assertEquals(5000.00, payroll.getNetSalary());
        assertEquals("G", payroll.getPayrollStatus());
        assertEquals("June", payroll.getPayrollMonth());
        assertEquals("2026", payroll.getPayrollYear());
    }

    @Test
    void testGeneratePayroll_AlreadyGenerated() {
        Staff staff = new Staff();
        staff.setId(1L);

        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(payrollGenerateRepository.findByStaffIdAndPayrollMonthAndPayrollYear(1L, "June", "2026"))
                .thenReturn(Optional.of(new PayrollGenerate()));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            hrService.generatePayroll(1L, "June", "2026");
        });

        assertTrue(exception.getMessage().contains("Payroll already generated"));
    }
}
