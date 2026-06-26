package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.HostelRoom;
import java.util.List;

public interface HostelRoomService {
    List<HostelRoom> getAll();
    HostelRoom getById(Long id);
    HostelRoom create(HostelRoom entity);
    HostelRoom update(Long id, HostelRoom entity);
    void delete(Long id);
}
