package com.sac.erp.modules.wallet.service;

import com.sac.erp.modules.wallet.entity.WalletSetting;
import com.sac.erp.modules.wallet.entity.WalletTransaction;
import com.sac.erp.modules.wallet.repository.WalletSettingRepository;
import com.sac.erp.modules.wallet.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WalletServiceImpl implements WalletService {

    private final WalletTransactionRepository transactionRepository;
    private final WalletSettingRepository settingRepository;

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getWalletBalance(Long userId, String schoolId) {
        return transactionRepository.getBalanceByUserIdAndSchoolId(userId, schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WalletTransaction> getTransactionHistory(Long userId, String schoolId) {
        return transactionRepository.findByUserIdAndSchoolIdOrderByCreatedAtDesc(userId, schoolId);
    }

    @Override
    public WalletTransaction addWalletAmount(Long userId, String schoolId, BigDecimal amount, String paymentGateway, String referenceNo) {
        WalletTransaction transaction = WalletTransaction.builder()
                .userId(userId)
                .schoolId(schoolId)
                .amount(amount)
                .transactionType("CREDIT")
                .status("PENDING")
                .paymentGateway(paymentGateway)
                .referenceNo(referenceNo)
                .build();
        return transactionRepository.save(transaction);
    }

    @Override
    public WalletTransaction confirmWalletPayment(Long transactionId, String schoolId) {
        WalletTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
        if (!transaction.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Invalid school access");
        }
        transaction.setStatus("CONFIRMED");
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public WalletSetting getWalletSetting(String schoolId) {
        return settingRepository.findBySchoolId(schoolId)
                .orElseGet(() -> settingRepository.save(WalletSetting.builder()
                        .schoolId(schoolId)
                        .isActive(true)
                        .minAmount(BigDecimal.ZERO)
                        .maxAmount(new BigDecimal("100000"))
                        .currency("USD")
                        .build()));
    }

    @Override
    public WalletSetting saveWalletSetting(WalletSetting walletSetting) {
        return settingRepository.save(walletSetting);
    }
}
