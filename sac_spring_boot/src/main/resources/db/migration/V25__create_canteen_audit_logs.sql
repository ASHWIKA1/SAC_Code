CREATE TABLE IF NOT EXISTS sm_canteen_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    old_balance DECIMAL(15,2) NOT NULL,
    new_balance DECIMAL(15,2) NOT NULL,
    student_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    pos_device_id VARCHAR(255) NULL,
    ip_address VARCHAR(255) NULL,
    reason_code VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,
    is_deleted INT DEFAULT 0
);
