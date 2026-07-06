package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.*;
import java.util.List;

public interface FeesService {
    List<FeesGroup> getAllFeesGroups();
    FeesGroup createFeesGroup(FeesGroup feesGroup);

    List<FeesType> getAllFeesTypes();
    FeesType createFeesType(FeesType feesType);

    List<FeesMaster> getAllFeesMasters();
    FeesMaster createFeesMaster(FeesMaster feesMaster);

    List<FeesDiscount> getAllFeesDiscounts();
    FeesDiscount createFeesDiscount(FeesDiscount feesDiscount);

    List<FeesPayment> getPaymentsByStudent(Long studentId);
    FeesPayment collectPayment(FeesPayment payment);
}
