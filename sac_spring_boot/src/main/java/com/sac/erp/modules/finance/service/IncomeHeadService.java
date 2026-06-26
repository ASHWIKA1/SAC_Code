package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.IncomeHead;
import java.util.List;

public interface IncomeHeadService {
    List<IncomeHead> getAll();
    IncomeHead getById(Long id);
    IncomeHead create(IncomeHead entity);
    IncomeHead update(Long id, IncomeHead entity);
    void delete(Long id);
}
