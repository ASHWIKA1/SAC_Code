package com.sac.erp.modules.notification.service;

import com.sac.erp.modules.notification.entity.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getUnreadNotifications(Long userId, String schoolId);
    List<Notification> getAllNotifications(Long userId, String schoolId);
    long getUnreadCount(Long userId, String schoolId);
    Notification createNotification(Notification notification);
    Notification markAsRead(Long id, Long userId, String schoolId);
    void markAllAsRead(Long userId, String schoolId);
}
