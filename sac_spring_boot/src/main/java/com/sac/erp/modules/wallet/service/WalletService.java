package com.sac.erp.modules.wallet.service;

import com.sac.erp.modules.wallet.entity.WalletTransaction;
import com.sac.erp.modules.wallet.entity.WalletSetting;

import java.math.BigDecimal;
import java.util.List;

public interface WalletService {
    BigDecimal getWalletBalance(Long userId, String schoolId);
    List<WalletTransaction> getTransactionHistory(Long userId, String schoolId);
    WalletTransaction addWalletAmount(Long userId, String schoolId, BigDecimal amount, String paymentGateway, String referenceNo);
    WalletTransaction confirmWalletPayment(Long transactionId, String schoolId);
    WalletSetting getWalletSetting(String schoolId);
    WalletSetting saveWalletSetting(WalletSetting walletSetting);
}
