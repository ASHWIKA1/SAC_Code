package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.ExpenseHead;
import java.util.List;

public interface ExpenseHeadService {
    List<ExpenseHead> getAll();
    ExpenseHead getById(Long id);
    ExpenseHead create(ExpenseHead entity);
    ExpenseHead update(Long id, ExpenseHead entity);
    void delete(Long id);
}
