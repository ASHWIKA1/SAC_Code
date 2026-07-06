package com.sac.erp.modules.canteen.service;

import com.sac.erp.modules.canteen.entity.CanteenWallet;
import java.util.List;

public interface CanteenWalletService {
    List<CanteenWallet> getAll();
    CanteenWallet getById(Long id);
    CanteenWallet create(CanteenWallet entity);
    CanteenWallet update(Long id, CanteenWallet entity);
    void delete(Long id);
}
