package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.Hostel;
import java.util.List;

public interface HostelService {
    List<Hostel> getAll();
    Hostel getById(Long id);
    Hostel create(Hostel entity);
    Hostel update(Long id, Hostel entity);
    void delete(Long id);
}
