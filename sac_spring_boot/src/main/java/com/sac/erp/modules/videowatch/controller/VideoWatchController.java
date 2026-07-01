package com.sac.erp.modules.videowatch.controller;

import com.sac.erp.modules.videowatch.entity.VideoWatch;
import com.sac.erp.modules.videowatch.service.VideoWatchService;
import com.sac.erp.modules.core.repository.UserRepository;
import com.sac.erp.modules.core.entity.User;
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
@RequestMapping("/api/v1/videos")
@RequiredArgsConstructor
public class VideoWatchController {

    private final VideoWatchService videoWatchService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<VideoWatch>> getVideos(
            @RequestParam(value = "classId", required = false) Long classId,
            @RequestParam(value = "subjectId", required = false) Long subjectId) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Fetching videos for school: {} (classId: {}, subjectId: {})", schoolId, classId, subjectId);

        List<VideoWatch> list;
        if (classId != null) {
            list = videoWatchService.getVideosByClass(schoolId, classId);
        } else if (subjectId != null) {
            list = videoWatchService.getVideosBySubject(schoolId, subjectId);
        } else {
            list = videoWatchService.getActiveVideos(schoolId);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoWatch> getVideo(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(videoWatchService.getVideoById(id, schoolId));
    }

    @PostMapping
    public ResponseEntity<VideoWatch> createVideo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody VideoWatch video) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Creating video: '{}' uploaded by: {}", video.getTitle(), user.getUsername());
        return ResponseEntity.ok(videoWatchService.createVideo(video, user.getId(), schoolId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoWatch> updateVideo(
            @PathVariable Long id,
            @RequestBody VideoWatch video) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Updating video: {}", id);
        return ResponseEntity.ok(videoWatchService.updateVideo(id, video, schoolId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVideo(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Deleting video: {}", id);
        videoWatchService.deleteVideo(id, schoolId);
        return ResponseEntity.ok(Map.of("message", "Video watches record deleted successfully"));
    }

    @PostMapping("/{id}/watch")
    public ResponseEntity<VideoWatch> watchVideo(@PathVariable Long id) {
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Incrementing watch count for video: {}", id);
        return ResponseEntity.ok(videoWatchService.incrementWatchCount(id, schoolId));
    }
}
