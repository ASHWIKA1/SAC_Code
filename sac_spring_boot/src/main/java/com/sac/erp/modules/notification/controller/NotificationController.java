package com.sac.erp.modules.notification.controller;

import com.sac.erp.modules.notification.entity.Notification;
import com.sac.erp.modules.notification.service.NotificationService;
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
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "unreadOnly", defaultValue = "false") boolean unreadOnly) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Fetching notifications for user: {} (unreadOnly: {})", user.getUsername(), unreadOnly);

        List<Notification> list = unreadOnly 
                ? notificationService.getUnreadNotifications(user.getId(), schoolId)
                : notificationService.getAllNotifications(user.getId(), schoolId);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        long count = notificationService.getUnreadCount(user.getId(), schoolId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        String schoolId = TenantContext.getCurrentTenant();
        notification.setSchoolId(schoolId);
        log.info("Creating new notification for user: {}", notification.getUserId());
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Marking notification {} as read for user: {}", id, user.getUsername());
        return ResponseEntity.ok(notificationService.markAsRead(id, user.getId(), schoolId));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> readAll(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Marking all notifications as read for user: {}", user.getUsername());
        notificationService.markAllAsRead(user.getId(), schoolId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
