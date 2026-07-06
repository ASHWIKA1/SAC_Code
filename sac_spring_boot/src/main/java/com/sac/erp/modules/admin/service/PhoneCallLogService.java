package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.PhoneCallLog;
import java.util.List;

public interface PhoneCallLogService {
    List<PhoneCallLog> getAll();
    PhoneCallLog getById(Long id);
    PhoneCallLog create(PhoneCallLog entity);
    PhoneCallLog update(Long id, PhoneCallLog entity);
    void delete(Long id);
}
