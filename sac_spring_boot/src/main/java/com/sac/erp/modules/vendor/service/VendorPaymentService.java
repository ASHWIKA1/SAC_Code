package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.VendorPaymentDto;
import com.sac.erp.modules.vendor.entity.VendorPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface VendorPaymentService {
    VendorPayment createPayment(VendorPaymentDto dto, String schoolId, Long userId);
    VendorPayment updatePayment(Long id, VendorPaymentDto dto, String schoolId, Long userId);
    VendorPayment getPaymentById(Long id, String schoolId);
    Page<VendorPayment> searchPayments(String search, Pageable pageable, String schoolId);
    VendorPayment verifyInvoice(Long id, String status, String schoolId, Long userId);
    VendorPayment makePayment(Long id, String bankTransferDetails, String schoolId, Long userId);
    List<VendorPayment> getPaymentsBySchool(String schoolId);
}
