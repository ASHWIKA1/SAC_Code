package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.AmountTransfer;
import java.util.List;

public interface AmountTransferService {
    List<AmountTransfer> getAll();
    AmountTransfer getById(Long id);
    AmountTransfer create(AmountTransfer entity);
    AmountTransfer update(Long id, AmountTransfer entity);
    void delete(Long id);
}
