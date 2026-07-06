package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.BankPaymentSlip;
import java.util.List;

public interface BankPaymentSlipService {
    List<BankPaymentSlip> getAll();
    BankPaymentSlip getById(Long id);
    BankPaymentSlip create(BankPaymentSlip entity);
    BankPaymentSlip update(Long id, BankPaymentSlip entity);
    void delete(Long id);
}
