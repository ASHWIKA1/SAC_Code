package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanteenAuditLogRepository extends JpaRepository<CanteenAuditLog, Long> {
}
