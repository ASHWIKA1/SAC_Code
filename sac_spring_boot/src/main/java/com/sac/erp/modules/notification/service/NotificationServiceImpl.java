package com.sac.erp.modules.notification.service;

import com.sac.erp.modules.notification.entity.Notification;
import com.sac.erp.modules.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId, String schoolId) {
        return notificationRepository.findByUserIdAndSchoolIdAndIsReadFalseOrderByCreatedAtDesc(userId, schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getAllNotifications(Long userId, String schoolId) {
        return notificationRepository.findByUserIdAndSchoolIdOrderByCreatedAtDesc(userId, schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId, String schoolId) {
        return notificationRepository.countByUserIdAndSchoolIdAndIsReadFalse(userId, schoolId);
    }

    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public Notification markAsRead(Long id, Long userId, String schoolId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!notification.getUserId().equals(userId) || !notification.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Access denied to notification");
        }
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId, String schoolId) {
        notificationRepository.markAllReadByUserIdAndSchoolId(userId, schoolId);
    }
}
