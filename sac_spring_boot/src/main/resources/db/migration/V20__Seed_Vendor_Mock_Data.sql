-- Flyway seed script to populate Vendor Module tables with high-fidelity mock records

-- 1. Vendors
INSERT INTO sm_vendors (id, vendor_code, vendor_name, company_name, vendor_type, contact_person, mobile, email, status, school_id) VALUES
(1, 'VEND-1029', 'Global IT Solutions', 'Global IT Solutions Ltd', 'Service Provider', 'Alice Vance', '+1 456-902-3920', 'alice@globalit.com', 'Active', 1),
(2, 'VEND-4091', 'Apex Machinery & Tools', 'Apex Machinery Inc', 'Supplier', 'Bob Miller', '+91 99283-10293', 'sales@apexmach.com', 'Active', 1),
(3, 'VEND-5810', 'Dr. Evelyn Carter', 'Evelyn Carter Consultancy', 'Consultant', 'Evelyn Carter', '+44 7911-120394', 'carter@evelyn.org', 'Pending Approval', 1)
ON DUPLICATE KEY UPDATE vendor_name=VALUES(vendor_name);

-- 2. Documents
INSERT INTO sm_vendor_documents (id, vendor_id, document_type, document_number, file_url, expiry_date, status, remarks, school_id) VALUES
(1, 1, 'GST Certificate', '29AAAAA0000A1Z5', '/uploads/docs/gst_glb.pdf', '2028-10-12', 'Verified', 'Clear and verified by Auditor.', 1),
(2, 2, 'PAN Card', 'APEXM1092P', '/uploads/docs/pan_apx.pdf', '2030-01-01', 'Pending', 'Awaiting secondary scan verification.', 1)
ON DUPLICATE KEY UPDATE document_number=VALUES(document_number);

-- 3. NDA agreements
INSERT INTO sm_vendor_ndas (id, vendor_id, nda_number, effective_date, expiry_date, confidentiality_level, status, school_id) VALUES
(1, 1, 'NDA-2026-902A', '2026-01-10', '2028-01-10', 'High', 'Active', 1)
ON DUPLICATE KEY UPDATE nda_number=VALUES(nda_number);

-- 4. MOU logs
INSERT INTO sm_vendor_mous (id, vendor_id, mou_number, purpose, start_date, end_date, contract_value, approval_status, school_id) VALUES
(1, 2, 'MOU-APEX-092', 'Supply of Heavy Science laboratory test gears', '2026-02-15', '2027-02-15', 120000.00, 'Approved', 1)
ON DUPLICATE KEY UPDATE mou_number=VALUES(mou_number);

-- 5. Contracts / Agreements
INSERT INTO sm_vendor_agreements (id, vendor_id, agreement_number, agreement_type, effective_date, expiry_date, contract_value, renewal_date, penalty_clause, terms_conditions, approval_status, school_id) VALUES
(1, 1, 'AGR-GLB-291', 'Annual Maintenance Contract', '2026-03-01', '2027-03-01', 45000.00, '2027-02-15', '2% delay penalty', 'Standard service level terms.', 'Approved', 1)
ON DUPLICATE KEY UPDATE agreement_number=VALUES(agreement_number);

-- 6. Consultants
INSERT INTO sm_vendor_consultants (id, consultant_id_str, name, specialization, experience_years, hourly_rate, performance_rating, total_payments, status, school_id) VALUES
(1, 'CONS-9021', 'Dr. Evelyn Carter', 'Organic chemistry curriculum', 14, 150.00, 4.80, 18500.00, 'Active', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 7. Purchase Requests
INSERT INTO sm_vendor_purchase_requests (id, request_number, department_id, requested_by_id, priority, required_date, items, estimated_cost, justification, approval_status, school_id) VALUES
(1, 'PR-9021', 3, 1, 'High', '2026-08-10', '[{"name":"Science Lab Kit","qty":200}]', 24000.00, 'Replacing science lab gears for new session.', 'Approved', 1)
ON DUPLICATE KEY UPDATE request_number=VALUES(request_number);

-- 8. Purchase Orders
INSERT INTO sm_vendor_purchase_orders (id, po_number, vendor_id, items, quantity, rate, gst, discount, delivery_date, po_status, revision_number, school_id) VALUES
(1, 'PO-4091', 2, '[{"item":"Test Kit","rate":120,"qty":200}]', 200, 24000.00, 4320.00, 500.00, '2026-08-20', 'Sent', 1, 1),
(2, 'PO-1029', 1, '[{"item":"Cloud Server Setup","rate":1500,"qty":2}]', 2, 3000.00, 540.00, 100.00, '2026-08-25', 'Sent', 0, 1),
(3, 'PO-8821', 2, '[{"item":"Safety Goggles","rate":15,"qty":500}]', 500, 7500.00, 1350.00, 200.00, '2026-09-01', 'Draft', 0, 1),
(4, 'PO-5510', 3, '[{"item":"Consulting Hours","rate":150,"qty":40}]', 40, 6000.00, 0.00, 0.00, '2026-08-15', 'Received', 2, 1),
(5, 'PO-3042', 1, '[{"item":"Laptop Upgrades","rate":400,"qty":10}]', 10, 4000.00, 720.00, 150.00, '2026-08-30', 'Sent', 0, 1)
ON DUPLICATE KEY UPDATE po_number=VALUES(po_number);

-- 9. Expected Deliveries
INSERT INTO sm_vendor_deliveries (id, po_id, expected_date, dispatch_date, courier_details, tracking_number, delivery_status, school_id) VALUES
(1, 1, '2026-08-20', '2026-08-15', 'DHL Express', 'DHL98710293', 'Shipped', 1)
ON DUPLICATE KEY UPDATE tracking_number=VALUES(tracking_number);

-- 10. Goods Receipt Notes (GRN)
INSERT INTO sm_vendor_grns (id, grn_number, po_id, received_quantity, accepted_quantity, rejected_quantity, inspection_remarks, store_location_id, school_id) VALUES
(1, 'GRN-4091', 1, 200, 198, 2, '2 units shattered during courier handling.', 1, 1)
ON DUPLICATE KEY UPDATE grn_number=VALUES(grn_number);

-- 11. Payments / Invoices
INSERT INTO sm_vendor_payments (id, invoice_number, vendor_id, po_id, invoice_amount, gst_amount, tds_amount, payment_request_status, payment_status, bank_transfer_details, outstanding_balance, school_id) VALUES
(1, 'INV-APX-8092', 2, 1, 24000.00, 4320.00, 480.00, 'Approved', 'Unpaid', '', 27840.00, 1)
ON DUPLICATE KEY UPDATE invoice_number=VALUES(invoice_number);

-- 12. Performance Ratings
INSERT INTO sm_vendor_performances (id, vendor_id, delivery_performance, quality_rating, pricing, overall_rating, rating_level, blacklist_recommendation, feedback, school_id) VALUES
(1, 1, 4.80, 4.90, 4.50, 4.73, 'Excellent', 0, 'AI PERFORMANCE ASSESSMENT REPORT FOR GLOBAL IT SOLUTIONS\n==========================================\n• Overall Score Index: 4.73/5.00\n• Quality standards are excellent. Product reliability is high.\n• Dispatch times and delivery performance are highly consistent.\n\nRECOMMENDATION: Highly recommended supplier. Safe to renew and expand agreements.', 1)
ON DUPLICATE KEY UPDATE rating_level=VALUES(rating_level);

-- 13. System Audit logs
INSERT INTO sm_vendor_audit_logs (id, action, performed_by, details, school_id) VALUES
(1, 'CREATE_VENDOR', 'Admin', 'Registered new supplier: Global IT Solutions', 1),
(2, 'APPROVE_PR', 'HOD Science', 'Approved purchase request PR-9021', 1)
ON DUPLICATE KEY UPDATE action=VALUES(action);
