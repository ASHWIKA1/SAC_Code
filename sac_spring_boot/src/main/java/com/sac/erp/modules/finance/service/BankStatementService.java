package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.BankStatement;
import java.util.List;

public interface BankStatementService {
    List<BankStatement> getAll();
    BankStatement getById(Long id);
    BankStatement create(BankStatement entity);
    BankStatement update(Long id, BankStatement entity);
    void delete(Long id);
}
