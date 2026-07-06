package com.sac.erp.modules.hr.controller;

import com.sac.erp.modules.hr.dto.LeaveDefineDto;
import com.sac.erp.modules.hr.dto.LeaveRequestDto;
import com.sac.erp.modules.hr.dto.LeaveTypeDto;
import com.sac.erp.modules.hr.entity.LeaveDefine;
import com.sac.erp.modules.hr.entity.LeaveRequest;
import com.sac.erp.modules.hr.entity.LeaveType;
import com.sac.erp.modules.hr.service.HrService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/hr/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final HrService hrService;

    // Leave Types
    @GetMapping("/types")
    public ResponseEntity<List<LeaveTypeDto>> getAllLeaveTypes() {
        log.info("REST request to get all leave types");
        List<LeaveTypeDto> list = hrService.getAllLeaveTypes().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/types")
    public ResponseEntity<LeaveTypeDto> createLeaveType(@Valid @RequestBody LeaveTypeDto dto) {
        log.info("REST request to create leave type: {}", dto.getType());
        LeaveType leaveType = new LeaveType();
        leaveType.setType(dto.getType());
        leaveType.setTotalDays(dto.getTotalDays());
        leaveType.setActiveStatus(dto.getActiveStatus() != null ? dto.getActiveStatus() : 1);
        leaveType.setAcademicId(dto.getAcademicId());
        
        LeaveType saved = hrService.createLeaveType(leaveType);
        return ResponseEntity.ok(toDto(saved));
    }

    // Leave Definitions
    @GetMapping("/definitions")
    public ResponseEntity<List<LeaveDefineDto>> getAllLeaveDefinitions() {
        log.info("REST request to get all leave definitions");
        List<LeaveDefineDto> list = hrService.getAllLeaveDefinitions().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/definitions")
    public ResponseEntity<LeaveDefineDto> createLeaveDefine(@Valid @RequestBody LeaveDefineDto dto) {
        log.info("REST request to create leave define for role/user: {}/{}", dto.getRoleId(), dto.getUserId());
        LeaveDefine leaveDefine = new LeaveDefine();
        leaveDefine.setDays(dto.getDays());
        leaveDefine.setActiveStatus(dto.getActiveStatus() != null ? dto.getActiveStatus() : 1);
        leaveDefine.setRoleId(dto.getRoleId());
        leaveDefine.setUserId(dto.getUserId());
        leaveDefine.setAcademicId(dto.getAcademicId());

        LeaveDefine saved = hrService.createLeaveDefine(leaveDefine, dto.getLeaveTypeId());
        return ResponseEntity.ok(toDto(saved));
    }

    // Leave Requests
    @GetMapping("/requests")
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaveRequests() {
        log.info("REST request to get all leave requests");
        List<LeaveRequestDto> list = hrService.getAllLeaveRequests().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/requests/staff/{userId}")
    public ResponseEntity<List<LeaveRequestDto>> getLeaveRequestsByStaff(@PathVariable Long userId) {
        log.info("REST request to get leave requests for user: {}", userId);
        List<LeaveRequestDto> list = hrService.getLeaveRequestsByStaff(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/requests/apply/{userId}")
    public ResponseEntity<LeaveRequestDto> applyLeave(@PathVariable Long userId, @Valid @RequestBody LeaveRequestDto dto) {
        log.info("REST request to apply leave for user: {}", userId);
        LeaveRequest request = new LeaveRequest();
        request.setApplyDate(dto.getApplyDate());
        request.setLeaveFrom(dto.getLeaveFrom());
        request.setLeaveTo(dto.getLeaveTo());
        request.setReason(dto.getReason());
        request.setNote(dto.getNote());
        request.setFile(dto.getFile());
        request.setAcademicId(dto.getAcademicId());

        LeaveRequest saved = hrService.applyLeave(request, userId, dto.getLeaveDefineId());
        return ResponseEntity.ok(toDto(saved));
    }

    @PostMapping("/requests/approve/{id}")
    public ResponseEntity<LeaveRequestDto> approveLeave(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String note) {
        log.info("REST request to approve leave request: {} with status: {}", id, status);
        LeaveRequest updated = hrService.approveLeave(id, status, note);
        return ResponseEntity.ok(toDto(updated));
    }

    // Helper conversion methods
    private LeaveTypeDto toDto(LeaveType entity) {
        LeaveTypeDto dto = new LeaveTypeDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setTotalDays(entity.getTotalDays());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setAcademicId(entity.getAcademicId());
        return dto;
    }

    private LeaveDefineDto toDto(LeaveDefine entity) {
        LeaveDefineDto dto = new LeaveDefineDto();
        dto.setId(entity.getId());
        dto.setDays(entity.getDays());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setRoleId(entity.getRoleId());
        dto.setUserId(entity.getUserId());
        dto.setTotalDays(entity.getTotalDays());
        dto.setAcademicId(entity.getAcademicId());
        if (entity.getLeaveType() != null) {
            dto.setLeaveTypeId(entity.getLeaveType().getId());
        }
        return dto;
    }

    private LeaveRequestDto toDto(LeaveRequest entity) {
        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setId(entity.getId());
        dto.setApplyDate(entity.getApplyDate());
        dto.setLeaveFrom(entity.getLeaveFrom());
        dto.setLeaveTo(entity.getLeaveTo());
        dto.setReason(entity.getReason());
        dto.setNote(entity.getNote());
        dto.setFile(entity.getFile());
        dto.setApproveStatus(entity.getApproveStatus());
        dto.setActiveStatus(entity.getActiveStatus());
        dto.setRoleId(entity.getRoleId());
        dto.setAcademicId(entity.getAcademicId());
        if (entity.getLeaveDefine() != null) {
            dto.setLeaveDefineId(entity.getLeaveDefine().getId());
        }
        if (entity.getStaff() != null) {
            dto.setStaffId(entity.getStaff().getId());
        }
        if (entity.getLeaveType() != null) {
            dto.setLeaveTypeId(entity.getLeaveType().getId());
        }
        return dto;
    }
}
