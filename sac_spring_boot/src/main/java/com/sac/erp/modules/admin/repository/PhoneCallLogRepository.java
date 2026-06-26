package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.PhoneCallLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhoneCallLogRepository extends JpaRepository<PhoneCallLog, Long> {
    List<PhoneCallLog> findByActiveStatus(Integer activeStatus);
}
