package com.sac.erp.modules.notification.repository;

import com.sac.erp.modules.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndSchoolIdAndIsReadFalseOrderByCreatedAtDesc(Long userId, String schoolId);

    List<Notification> findByUserIdAndSchoolIdOrderByCreatedAtDesc(Long userId, String schoolId);

    long countByUserIdAndSchoolIdAndIsReadFalse(Long userId, String schoolId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.schoolId = :schoolId")
    int markAllReadByUserIdAndSchoolId(Long userId, String schoolId);
}
