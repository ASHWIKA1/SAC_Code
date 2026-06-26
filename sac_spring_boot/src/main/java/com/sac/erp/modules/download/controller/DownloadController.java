package com.sac.erp.modules.download.controller;

import com.sac.erp.modules.download.entity.DownloadContent;
import com.sac.erp.modules.download.entity.DownloadContentType;
import com.sac.erp.modules.download.service.DownloadService;
import com.sac.erp.repository.UserRepository;
import com.sac.erp.entity.User;
import com.sac.erp.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<DownloadContent>> getDownloads(
            @RequestParam(value = "contentTypeId", required = false) Long contentTypeId) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Fetching downloads for school: {} (contentTypeId: {})", schoolId, contentTypeId);

        List<DownloadContent> list = (contentTypeId != null)
                ? downloadService.getDownloadsByType(schoolId, contentTypeId)
                : downloadService.getActiveDownloads(schoolId);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DownloadContent> getDownload(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(downloadService.getDownloadById(id, schoolId));
    }

    @PostMapping
    public ResponseEntity<DownloadContent> createDownload(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody DownloadContent content) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Creating download: '{}' uploaded by: {}", content.getTitle(), user.getUsername());
        return ResponseEntity.ok(downloadService.createDownload(content, user.getId(), schoolId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DownloadContent> updateDownload(
            @PathVariable Long id,
            @RequestBody DownloadContent content) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Updating download: {}", id);
        return ResponseEntity.ok(downloadService.updateDownload(id, content, schoolId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDownload(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Deleting download: {}", id);
        downloadService.deleteDownload(id, schoolId);
        return ResponseEntity.ok(Map.of("message", "Download content deleted successfully"));
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<DownloadContent> incrementDownloadCount(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Incrementing download count for file: {}", id);
        return ResponseEntity.ok(downloadService.incrementDownloadCount(id, schoolId));
    }

    @GetMapping("/types")
    public ResponseEntity<List<DownloadContentType>> getContentTypes() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(downloadService.getContentTypes(schoolId));
    }

    @PostMapping("/types")
    public ResponseEntity<DownloadContentType> createContentType(@RequestBody DownloadContentType contentType) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Creating content type: '{}'", contentType.getName());
        return ResponseEntity.ok(downloadService.createContentType(contentType, schoolId));
    }

    @DeleteMapping("/types/{id}")
    public ResponseEntity<Map<String, String>> deleteContentType(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Deleting content type: {}", id);
        downloadService.deleteContentType(id, schoolId);
        return ResponseEntity.ok(Map.of("message", "Content type deleted successfully"));
    }
}
