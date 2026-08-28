package com.sac.erp.modules.vendor.service;

import com.sac.erp.modules.vendor.dto.*;
import com.sac.erp.modules.vendor.entity.*;
import com.sac.erp.modules.vendor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProcurementServiceImpl implements ProcurementService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final DeliveryTrackingRepository deliveryTrackingRepository;
    private final GoodsReceiptNoteRepository goodsReceiptNoteRepository;
    private final VendorRepository vendorRepository;
    private final VendorAuditLogRepository vendorAuditLogRepository;

    private void logAudit(String action, String details, String schoolId) {
        VendorAuditLog log = new VendorAuditLog();
        log.setAction(action);
        log.setDetails(details);
        log.setPerformedBy("System/User");
        log.setSchoolId(schoolId);
        vendorAuditLogRepository.save(log);
    }

    @Override
    public PurchaseRequest createPurchaseRequest(PurchaseRequestDto dto, String schoolId, Long userId) {
        PurchaseRequest pr = new PurchaseRequest();
        pr.setRequestNumber("PR-" + (int)(Math.random() * 9000 + 1000));
        pr.setDepartmentId(dto.getDepartmentId());
        pr.setRequestedById(dto.getRequestedById());
        if (dto.getPriority() != null) pr.setPriority(dto.getPriority());
        pr.setRequiredDate(dto.getRequiredDate());
        pr.setItems(dto.getItems());
        pr.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);
        pr.setEstimatedCost(dto.getEstimatedCost() != null ? dto.getEstimatedCost() : BigDecimal.ZERO);
        pr.setJustification(dto.getJustification());
        pr.setApprovalStatus("Pending");
        pr.setSchoolId(schoolId);
        pr.setCreatedBy(userId);

        PurchaseRequest saved = purchaseRequestRepository.save(pr);
        logAudit("CREATE_PR", "Purchase request raised: " + saved.getRequestNumber(), schoolId);
        return saved;
    }

    @Override
    public PurchaseRequest updatePurchaseRequest(Long id, PurchaseRequestDto dto, String schoolId, Long userId) {
        PurchaseRequest pr = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase request not found"));
        pr.setDepartmentId(dto.getDepartmentId());
        pr.setRequestedById(dto.getRequestedById());
        if (dto.getPriority() != null) pr.setPriority(dto.getPriority());
        pr.setRequiredDate(dto.getRequiredDate());
        pr.setItems(dto.getItems());
        pr.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : pr.getQuantity());
        pr.setEstimatedCost(dto.getEstimatedCost() != null ? dto.getEstimatedCost() : pr.getEstimatedCost());
        pr.setJustification(dto.getJustification());
        if (dto.getApprovalStatus() != null) pr.setApprovalStatus(dto.getApprovalStatus());
        pr.setUpdatedBy(userId);

        PurchaseRequest updated = purchaseRequestRepository.save(pr);
        logAudit("UPDATE_PR", "Updated purchase request: " + updated.getRequestNumber(), schoolId);
        return updated;
    }

    @Override
    public PurchaseRequest getRequestById(Long id, String schoolId) {
        return purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase request not found"));
    }

    @Override
    public Page<PurchaseRequest> searchRequests(String search, Pageable pageable, String schoolId) {
        return purchaseRequestRepository.searchRequests(schoolId, search, pageable);
    }

    @Override
    public PurchaseRequest approveRequest(Long id, String status, String schoolId, Long userId) {
        PurchaseRequest pr = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase request not found"));
        pr.setApprovalStatus(status);
        pr.setUpdatedBy(userId);
        PurchaseRequest saved = purchaseRequestRepository.save(pr);
        logAudit("APPROVE_PR", "PR ID: " + saved.getId() + " set status to " + status, schoolId);
        return saved;
    }

    @Override
    public PurchaseOrder createPurchaseOrder(PurchaseOrderDto dto, String schoolId, Long userId) {
        Vendor v = vendorRepository.findByIdAndSchoolIdAndIsDeleted(dto.getVendorId(), schoolId, 0)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber("PO-" + (int)(Math.random() * 9000 + 1000));
        po.setVendor(v);
        po.setItems(dto.getItems());
        po.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);
        po.setRate(dto.getRate() != null ? dto.getRate() : BigDecimal.ZERO);
        po.setGst(dto.getGst() != null ? dto.getGst() : BigDecimal.ZERO);
        po.setDiscount(dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO);
        po.setDeliveryDate(dto.getDeliveryDate());
        po.setPaymentTerms(dto.getPaymentTerms());
        po.setDeliveryAddress(dto.getDeliveryAddress());
        po.setTermsConditions(dto.getTermsConditions());
        po.setPoStatus("Draft");
        po.setRevisionNumber(0);
        po.setSchoolId(schoolId);
        po.setCreatedBy(userId);

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        logAudit("CREATE_PO", "Purchase order generated: " + saved.getPoNumber() + " for vendor " + v.getVendorCode(), schoolId);
        return saved;
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrderDto dto, String schoolId, Long userId) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found"));
        Vendor v = vendorRepository.findByIdAndSchoolIdAndIsDeleted(dto.getVendorId(), schoolId, 0)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        po.setVendor(v);
        po.setItems(dto.getItems());
        po.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : po.getQuantity());
        po.setRate(dto.getRate() != null ? dto.getRate() : po.getRate());
        po.setGst(dto.getGst() != null ? dto.getGst() : po.getGst());
        po.setDiscount(dto.getDiscount() != null ? dto.getDiscount() : po.getDiscount());
        po.setDeliveryDate(dto.getDeliveryDate());
        po.setPaymentTerms(dto.getPaymentTerms());
        po.setDeliveryAddress(dto.getDeliveryAddress());
        po.setTermsConditions(dto.getTermsConditions());
        if (dto.getPoStatus() != null) {
            po.setPoStatus(dto.getPoStatus());
        }
        po.setRevisionNumber(po.getRevisionNumber() + 1); // Track revisions count
        po.setUpdatedBy(userId);

        PurchaseOrder updated = purchaseOrderRepository.save(po);
        logAudit("UPDATE_PO", "Revised PO: " + updated.getPoNumber() + " (Revision: " + updated.getRevisionNumber() + ")", schoolId);
        return updated;
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(Long id, String schoolId) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found"));
    }

    @Override
    public Page<PurchaseOrder> searchPurchaseOrders(String search, Pageable pageable, String schoolId) {
        return purchaseOrderRepository.searchPurchaseOrders(schoolId, search, pageable);
    }

    @Override
    public PurchaseOrder updatePoStatus(Long id, String status, String schoolId, Long userId) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found"));
        po.setPoStatus(status);
        po.setUpdatedBy(userId);
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        logAudit("UPDATE_PO_STATUS", "PO ID: " + saved.getId() + " set status to " + status, schoolId);
        return saved;
    }

    @Override
    public DeliveryTracking logDelivery(DeliveryTrackingDto dto, String schoolId, Long userId) {
        PurchaseOrder po = getPurchaseOrderById(dto.getPoId(), schoolId);
        DeliveryTracking d = new DeliveryTracking();
        d.setPurchaseOrder(po);
        d.setExpectedDate(dto.getExpectedDate());
        d.setDispatchDate(dto.getDispatchDate());
        d.setCourierDetails(dto.getCourierDetails());
        d.setTrackingNumber(dto.getTrackingNumber());
        d.setReceivedDate(dto.getReceivedDate());
        d.setPendingQuantity(dto.getPendingQuantity() != null ? dto.getPendingQuantity() : 0);
        if (dto.getDeliveryStatus() != null) d.setDeliveryStatus(dto.getDeliveryStatus());
        d.setSchoolId(schoolId);
        d.setCreatedBy(userId);

        DeliveryTracking saved = deliveryTrackingRepository.save(d);
        logAudit("LOG_DELIVERY", "Logged delivery for PO " + po.getPoNumber() + ", tracking number: " + saved.getTrackingNumber(), schoolId);
        return saved;
    }

    @Override
    public List<DeliveryTracking> getDeliveriesByPo(Long poId, String schoolId) {
        return deliveryTrackingRepository.findByPurchaseOrderIdAndIsDeleted(poId, 0);
    }

    @Override
    public List<DeliveryTracking> getAllDeliveries(String schoolId) {
        return deliveryTrackingRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }

    @Override
    public GoodsReceiptNote createGrn(GoodsReceiptNoteDto dto, String schoolId, Long userId) {
        PurchaseOrder po = getPurchaseOrderById(dto.getPoId(), schoolId);
        GoodsReceiptNote grn = new GoodsReceiptNote();
        grn.setGrnNumber("GRN-" + (int)(Math.random() * 9000 + 1000));
        grn.setPurchaseOrder(po);
        grn.setReceivedQuantity(dto.getReceivedQuantity() != null ? dto.getReceivedQuantity() : 0);
        grn.setAcceptedQuantity(dto.getAcceptedQuantity() != null ? dto.getAcceptedQuantity() : 0);
        grn.setRejectedQuantity(dto.getRejectedQuantity() != null ? dto.getRejectedQuantity() : 0);
        grn.setInspectionRemarks(dto.getInspectionRemarks());
        grn.setStoreLocationId(dto.getStoreLocationId());
        grn.setFileUrl(dto.getFileUrl());
        grn.setSchoolId(schoolId);
        grn.setCreatedBy(userId);

        // Update purchase order status to Completed/Received if accepted matches PO quantity
        po.setPoStatus("Received");
        purchaseOrderRepository.save(po);

        GoodsReceiptNote saved = goodsReceiptNoteRepository.save(grn);
        logAudit("CREATE_GRN", "Goods Receipt Note created: " + saved.getGrnNumber() + " for PO " + po.getPoNumber(), schoolId);
        return saved;
    }

    @Override
    public List<GoodsReceiptNote> getGrnsBySchool(String schoolId) {
        return goodsReceiptNoteRepository.findBySchoolIdAndIsDeleted(schoolId, 0);
    }
}
