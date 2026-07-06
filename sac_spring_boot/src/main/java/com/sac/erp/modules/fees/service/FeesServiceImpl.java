package com.sac.erp.modules.fees.service;

import com.sac.erp.modules.fees.entity.*;
import com.sac.erp.modules.fees.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeesServiceImpl implements FeesService {

    private final FeesGroupRepository feesGroupRepository;
    private final FeesTypeRepository feesTypeRepository;
    private final FeesMasterRepository feesMasterRepository;
    private final FeesDiscountRepository feesDiscountRepository;
    private final FeesPaymentRepository feesPaymentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FeesGroup> getAllFeesGroups() {
        return feesGroupRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public FeesGroup createFeesGroup(FeesGroup feesGroup) {
        return feesGroupRepository.save(feesGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeesType> getAllFeesTypes() {
        return feesTypeRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public FeesType createFeesType(FeesType feesType) {
        return feesTypeRepository.save(feesType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeesMaster> getAllFeesMasters() {
        return feesMasterRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public FeesMaster createFeesMaster(FeesMaster feesMaster) {
        return feesMasterRepository.save(feesMaster);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeesDiscount> getAllFeesDiscounts() {
        return feesDiscountRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public FeesDiscount createFeesDiscount(FeesDiscount feesDiscount) {
        return feesDiscountRepository.save(feesDiscount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeesPayment> getPaymentsByStudent(Long studentId) {
        return feesPaymentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional
    public FeesPayment collectPayment(FeesPayment payment) {
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(java.time.LocalDate.now());
        }
        return feesPaymentRepository.save(payment);
    }
}
