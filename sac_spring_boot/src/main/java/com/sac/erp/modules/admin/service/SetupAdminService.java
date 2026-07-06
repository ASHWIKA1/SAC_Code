package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.SetupAdmin;
import java.util.List;

public interface SetupAdminService {
    List<SetupAdmin> getAll();
    SetupAdmin getById(Long id);
    SetupAdmin create(SetupAdmin entity);
    SetupAdmin update(Long id, SetupAdmin entity);
    void delete(Long id);
}
