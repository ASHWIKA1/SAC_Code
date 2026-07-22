package com.sac.erp.modules.vendor.controller;

import com.sac.erp.modules.vendor.dto.ConsultantDto;
import com.sac.erp.modules.vendor.entity.Consultant;
import com.sac.erp.modules.vendor.service.ConsultantService;
import com.sac.erp.tenant.TenantContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vendors/consultants")
@RequiredArgsConstructor
public class ConsultantController {

    private final ConsultantService consultantService;

    @GetMapping
    public ResponseEntity<Page<Consultant>> getConsultants(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        String schoolId = TenantContext.getCurrentTenant();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return ResponseEntity.ok(consultantService.searchConsultants(search, PageRequest.of(page, size, sort), schoolId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultant> getConsultant(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(consultantService.getConsultantById(id, schoolId));
    }

    @PostMapping
    public ResponseEntity<Consultant> createConsultant(@Valid @RequestBody ConsultantDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(consultantService.createConsultant(dto, schoolId, 1L));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultant> updateConsultant(@PathVariable Long id, @Valid @RequestBody ConsultantDto dto) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(consultantService.updateConsultant(id, dto, schoolId, 1L));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteConsultant(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        consultantService.deleteConsultant(id, schoolId, 1L);
        return ResponseEntity.ok(Map.of("message", "Consultant deleted successfully"));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Consultant>> getAllConsultants() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(consultantService.getConsultantsBySchool(schoolId));
    }
}
