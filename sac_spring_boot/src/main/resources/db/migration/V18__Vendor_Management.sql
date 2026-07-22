-- Flyway Migration script for Vendor Management Module

-- 1. Vendors Table
CREATE TABLE IF NOT EXISTS sm_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_code VARCHAR(50) NOT NULL UNIQUE,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_type VARCHAR(100) NOT NULL, -- Supplier, Service Provider, Consultant, Contractor
    company_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(50) NULL,
    pan_number VARCHAR(50) NULL,
    tan_number VARCHAR(50) NULL,
    msme_status VARCHAR(50) DEFAULT 'No', -- Yes, No
    msme_registration_number VARCHAR(100) NULL,
    udyam_number VARCHAR(100) NULL,
    cin_number VARCHAR(100) NULL,
    iec_number VARCHAR(100) NULL,
    vendor_category VARCHAR(100) NULL,
    industry_type VARCHAR(100) NULL,
    business_nature VARCHAR(100) NULL,
    establishment_year INT NULL,
    website VARCHAR(255) NULL,
    contact_person VARCHAR(255) NULL,
    mobile VARCHAR(50) NULL,
    alternate_mobile VARCHAR(50) NULL,
    email VARCHAR(191) NULL,
    alternate_email VARCHAR(191) NULL,
    billing_address TEXT NULL,
    shipping_address TEXT NULL,
    country VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    pincode VARCHAR(50) NULL,
    account_holder VARCHAR(255) NULL,
    account_number VARCHAR(100) NULL,
    ifsc VARCHAR(50) NULL,
    bank_name VARCHAR(255) NULL,
    branch VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'Pending Approval', -- Active, Inactive, Blacklisted, Pending Approval
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Vendor Documents Table
CREATE TABLE IF NOT EXISTS sm_vendor_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- GST Certificate, PAN Card, MOU, NDA, etc.
    document_number VARCHAR(100) NULL,
    file_url VARCHAR(255) NOT NULL,
    issue_date DATE NULL,
    expiry_date DATE NULL,
    reminder_before_expiry_days INT DEFAULT 30,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Verified, Rejected, Expired
    verified_by VARCHAR(255) NULL,
    verified_date DATE NULL,
    remarks TEXT NULL,
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. NDA Management Table
CREATE TABLE IF NOT EXISTS sm_vendor_ndas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    nda_number VARCHAR(100) NOT NULL UNIQUE,
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    department_id INT UNSIGNED NULL, -- Links to sm_human_departments
    confidentiality_level VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High, Critical
    file_url VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Expired, Terminated
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. MOU Management Table
CREATE TABLE IF NOT EXISTS sm_vendor_mous (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    mou_number VARCHAR(100) NOT NULL UNIQUE,
    purpose TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    department_id INT UNSIGNED NULL, -- Links to sm_human_departments
    contract_value DECIMAL(15,2) DEFAULT 0.00,
    file_url VARCHAR(255) NULL,
    approval_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Agreement Management Table
CREATE TABLE IF NOT EXISTS sm_vendor_agreements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    agreement_number VARCHAR(100) NOT NULL UNIQUE,
    agreement_type VARCHAR(100) NOT NULL, -- Purchase Agreement, Service Agreement, AMC Agreement, etc.
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    contract_value DECIMAL(15,2) DEFAULT 0.00,
    renewal_date DATE NULL,
    penalty_clause TEXT NULL,
    terms_conditions TEXT NULL,
    approval_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    file_url VARCHAR(255) NULL,
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Consultant Management Table
CREATE TABLE IF NOT EXISTS sm_vendor_consultants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consultant_id_str VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NULL,
    department_id INT UNSIGNED NULL, -- Links to sm_human_departments
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    contract_start_date DATE NULL,
    contract_end_date DATE NULL,
    reporting_manager_id INT UNSIGNED NULL, -- Links to sm_staffs(id)
    agreement_id INT NULL,
    nda_id INT NULL,
    performance_rating DECIMAL(3,2) DEFAULT 0.00,
    invoices_submitted_count INT DEFAULT 0,
    total_payments DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Inactive
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Purchase Request Table
CREATE TABLE IF NOT EXISTS sm_vendor_purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(100) NOT NULL UNIQUE,
    department_id INT UNSIGNED NOT NULL, -- Links to sm_human_departments
    requested_by_id INT UNSIGNED NOT NULL, -- Links to users(id)
    priority VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High, Urgent
    required_date DATE NULL,
    items TEXT NOT NULL, -- JSON block
    quantity INT DEFAULT 0,
    estimated_cost DECIMAL(15,2) DEFAULT 0.00,
    justification TEXT NULL,
    approval_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Purchase Order Table
CREATE TABLE IF NOT EXISTS sm_vendor_purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(100) NOT NULL UNIQUE,
    vendor_id INT NOT NULL,
    items TEXT NOT NULL, -- JSON block
    quantity INT DEFAULT 0,
    rate DECIMAL(15,2) DEFAULT 0.00,
    gst DECIMAL(15,2) DEFAULT 0.00,
    discount DECIMAL(15,2) DEFAULT 0.00,
    delivery_date DATE NULL,
    payment_terms TEXT NULL,
    delivery_address TEXT NULL,
    terms_conditions TEXT NULL,
    po_status VARCHAR(50) DEFAULT 'Draft', -- Draft, Sent, Received, Cancelled
    revision_number INT DEFAULT 0,
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Delivery Tracking Table
CREATE TABLE IF NOT EXISTS sm_vendor_deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    expected_date DATE NULL,
    dispatch_date DATE NULL,
    courier_details VARCHAR(255) NULL,
    tracking_number VARCHAR(100) NULL,
    received_date DATE NULL,
    pending_quantity INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'Pending', -- Expected, Shipped, Delivered, Delayed, Pending
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (po_id) REFERENCES sm_vendor_purchase_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Goods Receipt Note (GRN) Table
CREATE TABLE IF NOT EXISTS sm_vendor_grns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grn_number VARCHAR(100) NOT NULL UNIQUE,
    po_id INT NOT NULL,
    received_quantity INT DEFAULT 0,
    accepted_quantity INT DEFAULT 0,
    rejected_quantity INT DEFAULT 0,
    inspection_remarks TEXT NULL,
    store_location_id INT UNSIGNED DEFAULT NULL, -- Links to sm_item_stores(id)
    file_url VARCHAR(255) NULL,
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (po_id) REFERENCES sm_vendor_purchase_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Vendor Performance Table
CREATE TABLE IF NOT EXISTS sm_vendor_performances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    delivery_performance DECIMAL(3,2) DEFAULT 5.00,
    quality_rating DECIMAL(3,2) DEFAULT 5.00,
    communication DECIMAL(3,2) DEFAULT 5.00,
    response_time DECIMAL(3,2) DEFAULT 5.00,
    pricing DECIMAL(3,2) DEFAULT 5.00,
    complaint_count INT DEFAULT 0,
    rejected_materials INT DEFAULT 0,
    compliance DECIMAL(3,2) DEFAULT 5.00,
    overall_rating DECIMAL(3,2) DEFAULT 5.00,
    rating_level VARCHAR(50) DEFAULT 'Good', -- Excellent, Good, Average, Poor
    blacklist_recommendation TINYINT(1) DEFAULT 0,
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Vendor Payment / Invoice Table
CREATE TABLE IF NOT EXISTS sm_vendor_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    vendor_id INT NOT NULL,
    po_id INT NULL,
    file_url VARCHAR(255) NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    tds_amount DECIMAL(15,2) DEFAULT 0.00,
    gst_amount DECIMAL(15,2) DEFAULT 0.00,
    invoice_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_request_status VARCHAR(50) DEFAULT 'Pending Approval', -- Pending Approval, Approved, Rejected
    payment_status VARCHAR(50) DEFAULT 'Unpaid', -- Unpaid, Partially Paid, Paid
    bank_transfer_details VARCHAR(255) NULL,
    outstanding_balance DECIMAL(15,2) DEFAULT 0.00,
    school_id INT UNSIGNED DEFAULT 1,
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED DEFAULT NULL,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (vendor_id) REFERENCES sm_vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (po_id) REFERENCES sm_vendor_purchase_orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Audit Log Table
CREATE TABLE IF NOT EXISTS sm_vendor_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    details TEXT NULL,
    performed_by VARCHAR(255) NOT NULL,
    school_id INT UNSIGNED DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
