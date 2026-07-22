package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.*;
import com.sac.erp.modules.vendor.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProcurementService {
    // Purchase Requests
    PurchaseRequest createPurchaseRequest(PurchaseRequestDto dto, String schoolId, Long userId);
    PurchaseRequest updatePurchaseRequest(Long id, PurchaseRequestDto dto, String schoolId, Long userId);
    PurchaseRequest getRequestById(Long id, String schoolId);
    Page<PurchaseRequest> searchRequests(String search, Pageable pageable, String schoolId);
    PurchaseRequest approveRequest(Long id, String status, String schoolId, Long userId);

    // Purchase Orders
    PurchaseOrder createPurchaseOrder(PurchaseOrderDto dto, String schoolId, Long userId);
    PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrderDto dto, String schoolId, Long userId);
    PurchaseOrder getPurchaseOrderById(Long id, String schoolId);
    Page<PurchaseOrder> searchPurchaseOrders(String search, Pageable pageable, String schoolId);
    PurchaseOrder updatePoStatus(Long id, String status, String schoolId, Long userId);

    // Delivery Tracking
    DeliveryTracking logDelivery(DeliveryTrackingDto dto, String schoolId, Long userId);
    List<DeliveryTracking> getDeliveriesByPo(Long poId, String schoolId);
    List<DeliveryTracking> getAllDeliveries(String schoolId);

    // Goods Receipt Note
    GoodsReceiptNote createGrn(GoodsReceiptNoteDto dto, String schoolId, Long userId);
    List<GoodsReceiptNote> getGrnsBySchool(String schoolId);
}
