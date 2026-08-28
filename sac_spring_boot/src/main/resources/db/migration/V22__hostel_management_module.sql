-- =============================================================================
-- Flyway Migration V22: Hostel Management Module
-- Adds new tables for room types, allocations, mess plans, mess billing,
-- discipline logs, and RFID gate scan logs. Alters existing hostel tables.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Ensure base tables exist (guard for databases where they may be missing)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostels (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hostel_name     VARCHAR(191)    NOT NULL,
    type            ENUM('boys','girls','mixed') NOT NULL DEFAULT 'mixed',
    address         TEXT            DEFAULT NULL,
    capacity        INT             NOT NULL DEFAULT 0,
    warden_name     VARCHAR(191)    DEFAULT NULL,
    warden_phone    VARCHAR(20)     DEFAULT NULL,
    warden_email    VARCHAR(191)    DEFAULT NULL,
    rfid_enabled    TINYINT(1)      NOT NULL DEFAULT 0,
    rfid_reader_id  VARCHAR(191)    DEFAULT NULL,
    facilities      TEXT            DEFAULT NULL,
    status          ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active',
    school_id       BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NULL DEFAULT NULL,
    updated_at      TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sm_hostel_rooms (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hostel_id       BIGINT UNSIGNED NOT NULL,
    room_no         VARCHAR(20)     NOT NULL,
    room_type       VARCHAR(191)    DEFAULT NULL,
    capacity        INT             NOT NULL DEFAULT 1,
    floor           INT             NOT NULL DEFAULT 0,
    fee_per_month   DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    amenities       TEXT            DEFAULT NULL,
    status          ENUM('available','occupied','maintenance','reserved') NOT NULL DEFAULT 'available',
    school_id       BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NULL DEFAULT NULL,
    updated_at      TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY sm_hostel_rooms_hostel_id_foreign (hostel_id),
    CONSTRAINT sm_hostel_rooms_hostel_id_fk FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 1. ALTER sm_hostels — add curfew_time column (idempotent)
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS add_curfew_time;
CREATE PROCEDURE add_curfew_time()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostels' AND COLUMN_NAME = 'curfew_time'
    ) THEN
        ALTER TABLE sm_hostels ADD COLUMN curfew_time TIME DEFAULT '22:00:00' AFTER facilities;
    END IF;
END;
CALL add_curfew_time();
DROP PROCEDURE IF EXISTS add_curfew_time;

-- ---------------------------------------------------------------------------
-- 2. ALTER sm_hostel_rooms — add current_occupancy column (idempotent)
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS add_current_occupancy;
CREATE PROCEDURE add_current_occupancy()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_rooms' AND COLUMN_NAME = 'current_occupancy'
    ) THEN
        ALTER TABLE sm_hostel_rooms ADD COLUMN current_occupancy INT NOT NULL DEFAULT 0 AFTER capacity;
    END IF;
END;
CALL add_current_occupancy();
DROP PROCEDURE IF EXISTS add_current_occupancy;

-- ---------------------------------------------------------------------------
-- 3. NEW TABLE: sm_hostel_room_types — Room type master data
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_room_types (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    type_name       VARCHAR(100)    NOT NULL,
    description     TEXT            DEFAULT NULL,
    base_fee        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    max_occupants   INT             NOT NULL DEFAULT 1,
    school_id       BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      BIGINT UNSIGNED DEFAULT NULL,
    updated_by      BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add room_type_id column to sm_hostel_rooms (idempotent)
DROP PROCEDURE IF EXISTS add_room_type_id;
CREATE PROCEDURE add_room_type_id()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_rooms' AND COLUMN_NAME = 'room_type_id'
    ) THEN
        ALTER TABLE sm_hostel_rooms ADD COLUMN room_type_id BIGINT UNSIGNED DEFAULT NULL AFTER room_type;
        ALTER TABLE sm_hostel_rooms ADD CONSTRAINT fk_rooms_room_type FOREIGN KEY (room_type_id) REFERENCES sm_hostel_room_types(id) ON DELETE SET NULL;
    END IF;
END;
CALL add_room_type_id();
DROP PROCEDURE IF EXISTS add_room_type_id;

-- ---------------------------------------------------------------------------
-- Seed Student Users & Students to satisfy foreign key constraints
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO users (id, name, email, username, password, role_id) VALUES
(5, 'Amit Kumar', 'amit@student.sac', 'amit', '$2a$10$abcdefghijklmnopqrstuv', 2),
(6, 'Priya Sharma', 'priya@student.sac', 'priya', '$2a$10$abcdefghijklmnopqrstuv', 2),
(7, 'Vikram Malhotra', 'vikram@student.sac', 'vikram', '$2a$10$abcdefghijklmnopqrstuv', 2),
(8, 'Karan Johar', 'karan@student.sac', 'karan', '$2a$10$abcdefghijklmnopqrstuv', 2);

INSERT IGNORE INTO sm_students (id, admission_no, roll_no, first_name, last_name, full_name, email, user_id, class_id, section_id, school_id, academic_id, active_status) VALUES
(4, 10004, 4, 'Amit', 'Kumar', 'Amit Kumar', 'amit@student.sac', 5, 1, 1, 1, 1, 1),
(5, 10005, 5, 'Priya', 'Sharma', 'Priya Sharma', 'priya@student.sac', 6, 1, 1, 1, 1, 1),
(6, 10006, 6, 'Vikram', 'Malhotra', 'Vikram Malhotra', 'vikram@student.sac', 7, 1, 1, 1, 1, 1),
(7, 10007, 7, 'Karan', 'Johar', 'Karan Johar', 'karan@student.sac', 8, 1, 1, 1, 1, 1);

-- ---------------------------------------------------------------------------
-- 4. NEW TABLE: sm_hostel_allocations — Student-to-room bed assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_allocations (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id      INT UNSIGNED NOT NULL,
    room_id         BIGINT UNSIGNED NOT NULL,
    hostel_id       BIGINT UNSIGNED NOT NULL,
    bed_number      INT             NOT NULL DEFAULT 1,
    allocation_date DATE            NOT NULL,
    vacate_date     DATE            DEFAULT NULL,
    status          ENUM('Active','Transferred','Vacated') NOT NULL DEFAULT 'Active',
    remarks         TEXT            DEFAULT NULL,
    school_id       BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      BIGINT UNSIGNED DEFAULT NULL,
    updated_by      BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_hostel_alloc_student   (student_id),
    KEY idx_hostel_alloc_room      (room_id),
    KEY idx_hostel_alloc_status    (status),
    CONSTRAINT fk_hostel_alloc_room   FOREIGN KEY (room_id)   REFERENCES sm_hostel_rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_hostel_alloc_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id)      ON DELETE CASCADE,
    CONSTRAINT fk_hostel_alloc_student FOREIGN KEY (student_id) REFERENCES sm_students(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 5. NEW TABLE: sm_hostel_mess_plans — Weekly mess menu (Mon-Sun x meals)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_mess_plans (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hostel_id       BIGINT UNSIGNED NOT NULL,
    day_of_week     ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    breakfast       VARCHAR(500)    DEFAULT NULL,
    lunch           VARCHAR(500)    DEFAULT NULL,
    dinner          VARCHAR(500)    DEFAULT NULL,
    snacks          VARCHAR(500)    DEFAULT NULL,
    effective_from  DATE            NOT NULL,
    effective_to    DATE            DEFAULT NULL,
    school_id       BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      BIGINT UNSIGNED DEFAULT NULL,
    updated_by      BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_mess_plan_hostel  (hostel_id),
    KEY idx_mess_plan_day     (day_of_week),
    CONSTRAINT fk_mess_plan_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 6. NEW TABLE: sm_hostel_mess_billings — Monthly mess billing per student
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_mess_billings (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id          INT UNSIGNED NOT NULL,
    hostel_id           BIGINT UNSIGNED NOT NULL,
    billing_month       VARCHAR(7)      NOT NULL,
    mess_plan           VARCHAR(100)    NOT NULL DEFAULT 'Standard',
    base_amount         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    additional_charges  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_amount        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    status              ENUM('Pending','Paid','Overdue') NOT NULL DEFAULT 'Pending',
    payment_date        DATE            DEFAULT NULL,
    payment_reference   VARCHAR(191)    DEFAULT NULL,
    remarks             TEXT            DEFAULT NULL,
    school_id           BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by          BIGINT UNSIGNED DEFAULT NULL,
    updated_by          BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_mess_bill_student (student_id),
    KEY idx_mess_bill_month   (billing_month),
    KEY idx_mess_bill_status  (status),
    CONSTRAINT fk_mess_bill_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE,
    CONSTRAINT fk_mess_bill_student FOREIGN KEY (student_id) REFERENCES sm_students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 7. NEW TABLE: sm_hostel_discipline_logs — Student discipline incidents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_discipline_logs (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id          INT UNSIGNED NOT NULL,
    hostel_id           BIGINT UNSIGNED NOT NULL,
    incident_type       VARCHAR(191)    NOT NULL,
    severity            ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Low',
    description         TEXT            DEFAULT NULL,
    action_taken        TEXT            DEFAULT NULL,
    reported_by         VARCHAR(191)    DEFAULT NULL,
    incident_date       DATE            NOT NULL,
    status              ENUM('Under Review','Resolved','Action Taken') NOT NULL DEFAULT 'Under Review',
    school_id           BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by          BIGINT UNSIGNED DEFAULT NULL,
    updated_by          BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_discipline_student  (student_id),
    KEY idx_discipline_severity (severity),
    KEY idx_discipline_status   (status),
    CONSTRAINT fk_discipline_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE,
    CONSTRAINT fk_discipline_student FOREIGN KEY (student_id) REFERENCES sm_students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 8. NEW TABLE: sm_hostel_rfid_logs — RFID gate scan entries
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_rfid_logs (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    student_id          INT UNSIGNED NOT NULL,
    hostel_id           BIGINT UNSIGNED NOT NULL,
    rfid_tag            VARCHAR(100)    DEFAULT NULL,
    scan_timestamp      DATETIME        NOT NULL,
    gate_direction      ENUM('IN','OUT') NOT NULL DEFAULT 'IN',
    entry_status        ENUM('In-Bounds','Late Entry','Unauthorized') NOT NULL DEFAULT 'In-Bounds',
    flagged             TINYINT(1)      NOT NULL DEFAULT 0,
    school_id           BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by          BIGINT UNSIGNED DEFAULT NULL,
    updated_by          BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_rfid_student    (student_id),
    KEY idx_rfid_timestamp  (scan_timestamp),
    KEY idx_rfid_status     (entry_status),
    CONSTRAINT fk_rfid_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE,
    CONSTRAINT fk_rfid_student FOREIGN KEY (student_id) REFERENCES sm_students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 9. ALTER sm_hostel_visitors — fix student_id type and add foreign keys
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS fix_visitor_fks;
CREATE PROCEDURE fix_visitor_fks()
BEGIN
    -- Fix student_id column type to match sm_students.id (INT UNSIGNED)
    IF EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_visitors'
        AND COLUMN_NAME = 'student_id' AND DATA_TYPE = 'bigint'
    ) THEN
        ALTER TABLE sm_hostel_visitors MODIFY COLUMN student_id INT UNSIGNED NOT NULL;
    END IF;
    -- Add fk_visitor_student if not already present
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_visitors'
        AND CONSTRAINT_NAME = 'fk_visitor_student'
    ) THEN
        ALTER TABLE sm_hostel_visitors ADD CONSTRAINT fk_visitor_student FOREIGN KEY (student_id) REFERENCES sm_students(id) ON DELETE CASCADE;
    END IF;
    -- Add fk_visitor_hostel if not already present
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_visitors'
        AND CONSTRAINT_NAME = 'fk_visitor_hostel'
    ) THEN
        ALTER TABLE sm_hostel_visitors ADD CONSTRAINT fk_visitor_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE;
    END IF;
END;
CALL fix_visitor_fks();
DROP PROCEDURE IF EXISTS fix_visitor_fks;

-- ===========================================================================
-- SEED DATA
-- ===========================================================================
SET FOREIGN_KEY_CHECKS=0;

-- Seed: sm_hostel_room_types
INSERT IGNORE INTO sm_hostel_room_types (type_name, description, base_fee, max_occupants, school_id) VALUES
('Single',    'Single occupancy room with attached bathroom',       3000.00, 1, 1),
('Double',    'Double sharing room with shared bathroom',           1500.00, 2, 1),
('Triple',    'Triple sharing room with common facilities',         1200.00, 3, 1),
('Dormitory', 'Open dormitory hall with shared amenities',           800.00, 8, 1);

-- Map existing rooms to room types
UPDATE sm_hostel_rooms r SET r.room_type_id = (SELECT id FROM sm_hostel_room_types t WHERE t.type_name = r.room_type LIMIT 1);

-- Seed: sm_hostel_allocations (8 allocations across both hostels)
INSERT IGNORE INTO sm_hostel_allocations (student_id, room_id, hostel_id, bed_number, allocation_date, vacate_date, status, remarks, school_id) VALUES
(1, 1, 1, 1, '2026-06-01', NULL,          'Active',      'Allocated at admission',           1),
(2, 1, 1, 2, '2026-06-01', NULL,          'Active',      'Allocated at admission',           1),
(3, 2, 1, 1, '2026-06-05', NULL,          'Active',      NULL,                               1),
(4, 3, 1, 1, '2026-06-05', '2026-07-10', 'Transferred', 'Moved to room b-104 per request',  1),
(4, 4, 1, 1, '2026-07-10', NULL,          'Active',      'Transfer from b-103',              1),
(5, 6, 2, 1, '2026-06-01', NULL,          'Active',      'Allocated at admission',           1),
(6, 6, 2, 2, '2026-06-01', NULL,          'Active',      NULL,                               1),
(7, 7, 2, 1, '2026-06-15', '2026-07-01', 'Vacated',     'Left hostel',                      1);

-- Update current_occupancy to match allocations
UPDATE sm_hostel_rooms SET current_occupancy = 2 WHERE id = 1;
UPDATE sm_hostel_rooms SET current_occupancy = 1 WHERE id = 2;
UPDATE sm_hostel_rooms SET current_occupancy = 0 WHERE id = 3;
UPDATE sm_hostel_rooms SET current_occupancy = 1 WHERE id = 4;
UPDATE sm_hostel_rooms SET current_occupancy = 0 WHERE id = 5;
UPDATE sm_hostel_rooms SET current_occupancy = 2 WHERE id = 6;
UPDATE sm_hostel_rooms SET current_occupancy = 0 WHERE id = 7;
UPDATE sm_hostel_rooms SET current_occupancy = 0 WHERE id = 8;
UPDATE sm_hostel_rooms SET current_occupancy = 0 WHERE id = 9;
UPDATE sm_hostel_rooms SET current_occupancy = 0 WHERE id = 10;

-- Seed: sm_hostel_mess_plans (7 days x 2 hostels = 14 rows)
INSERT INTO sm_hostel_mess_plans (hostel_id, day_of_week, breakfast, lunch, dinner, snacks, effective_from, school_id) VALUES
(1, 'Monday',    'Poha, Chai, Banana',           'Dal Rice, Roti, Sabzi, Salad',       'Paneer Butter Masala, Naan, Rice',   'Samosa, Tea',      '2026-07-01', 1),
(1, 'Tuesday',   'Idli Sambar, Coffee',           'Rajma Chawal, Raita, Pickle',        'Chole Bhature, Kheer',               'Bread Pakora, Tea', '2026-07-01', 1),
(1, 'Wednesday', 'Paratha, Curd, Pickle',         'Kadhi Pakora, Jeera Rice, Roti',     'Aloo Gobi, Dal Tadka, Roti, Rice',   'Biscuits, Milk',   '2026-07-01', 1),
(1, 'Thursday',  'Upma, Coconut Chutney, Juice',  'Matar Paneer, Roti, Pulao',          'Mix Veg, Dal Fry, Roti, Rice',       'Vada Pav, Tea',    '2026-07-01', 1),
(1, 'Friday',    'Aloo Paratha, Dahi, Achaar',    'Biryani, Raita, Papad',              'Malai Kofta, Naan, Jeera Rice',      'Fruit Chaat',      '2026-07-01', 1),
(1, 'Saturday',  'Puri Bhaji, Chai',              'Dal Makhani, Rice, Roti, Salad',     'Egg Curry / Paneer Tikka, Roti',     'Maggi, Tea',       '2026-07-01', 1),
(1, 'Sunday',    'Chole Bhature, Lassi',          'Special Thali - Pulao, Paneer, Dal', 'Butter Chicken / Shahi Paneer, Naan','Ice Cream',        '2026-07-01', 1),
(2, 'Monday',    'Poha, Chai, Banana',           'Dal Rice, Roti, Sabzi, Salad',       'Paneer Butter Masala, Naan, Rice',   'Samosa, Tea',      '2026-07-01', 1),
(2, 'Tuesday',   'Idli Sambar, Coffee',           'Rajma Chawal, Raita, Pickle',        'Chole Bhature, Kheer',               'Bread Pakora, Tea', '2026-07-01', 1),
(2, 'Wednesday', 'Paratha, Curd, Pickle',         'Kadhi Pakora, Jeera Rice, Roti',     'Aloo Gobi, Dal Tadka, Roti, Rice',   'Biscuits, Milk',   '2026-07-01', 1),
(2, 'Thursday',  'Upma, Coconut Chutney, Juice',  'Matar Paneer, Roti, Pulao',          'Mix Veg, Dal Fry, Roti, Rice',       'Vada Pav, Tea',    '2026-07-01', 1),
(2, 'Friday',    'Aloo Paratha, Dahi, Achaar',    'Biryani, Raita, Papad',              'Malai Kofta, Naan, Jeera Rice',      'Fruit Chaat',      '2026-07-01', 1),
(2, 'Saturday',  'Puri Bhaji, Chai',              'Dal Makhani, Rice, Roti, Salad',     'Egg Curry / Paneer Tikka, Roti',     'Maggi, Tea',       '2026-07-01', 1),
(2, 'Sunday',    'Chole Bhature, Lassi',          'Special Thali - Pulao, Paneer, Dal', 'Butter Chicken / Shahi Paneer, Naan','Ice Cream',        '2026-07-01', 1);

-- Seed: sm_hostel_mess_billings (10 records, mix of statuses)
INSERT IGNORE INTO sm_hostel_mess_billings (student_id, hostel_id, billing_month, mess_plan, base_amount, additional_charges, total_amount, status, payment_date, payment_reference, school_id) VALUES
(1, 1, '2026-06', 'Standard', 3500.00,  200.00, 3700.00, 'Paid',    '2026-07-05', 'TXN-MES-001', 1),
(2, 1, '2026-06', 'Standard', 3500.00,    0.00, 3500.00, 'Paid',    '2026-07-03', 'TXN-MES-002', 1),
(3, 1, '2026-06', 'Premium',  4500.00,  150.00, 4650.00, 'Paid',    '2026-07-08', 'TXN-MES-003', 1),
(1, 1, '2026-07', 'Standard', 3500.00,  300.00, 3800.00, 'Pending', NULL,          NULL,          1),
(2, 1, '2026-07', 'Standard', 3500.00,    0.00, 3500.00, 'Pending', NULL,          NULL,          1),
(3, 1, '2026-07', 'Premium',  4500.00,    0.00, 4500.00, 'Overdue', NULL,          NULL,          1),
(5, 2, '2026-06', 'Standard', 3500.00,  100.00, 3600.00, 'Paid',    '2026-07-02', 'TXN-MES-004', 1),
(6, 2, '2026-06', 'Veg-Only', 3200.00,    0.00, 3200.00, 'Paid',    '2026-07-04', 'TXN-MES-005', 1),
(5, 2, '2026-07', 'Standard', 3500.00,  250.00, 3750.00, 'Pending', NULL,          NULL,          1),
(6, 2, '2026-07', 'Veg-Only', 3200.00,    0.00, 3200.00, 'Overdue', NULL,          NULL,          1);

-- Seed: sm_hostel_discipline_logs (5 incidents)
INSERT IGNORE INTO sm_hostel_discipline_logs (student_id, hostel_id, incident_type, severity, description, action_taken, reported_by, incident_date, status, school_id) VALUES
(2, 1, 'Noise Complaint',   'Low',      'Loud music after 11 PM in room b-101',                    'Verbal warning issued',            'Warden jstwl', '2026-07-10', 'Resolved',      1),
(3, 1, 'Curfew Violation',  'Medium',   'Returned to hostel at 11:45 PM without prior permission',  'Written warning, parents notified','Warden jstwl', '2026-07-15', 'Action Taken',  1),
(4, 1, 'Property Damage',   'High',     'Broken window pane in common area during altercation',     NULL,                               'Warden jstwl', '2026-07-20', 'Under Review',  1),
(5, 2, 'Unauthorized Guest','Medium',   'Non-registered visitor found in room at 9 PM',             'One day suspension from mess',     'Warden mlBSB', '2026-07-12', 'Resolved',      1),
(6, 2, 'Mess Misconduct',   'Low',      'Food wastage reported by mess staff',                      'Community service assigned',       'Warden mlBSB', '2026-07-18', 'Action Taken',  1);

-- Seed: sm_hostel_rfid_logs (12 scan records, including 3 late entries)
INSERT IGNORE INTO sm_hostel_rfid_logs (student_id, hostel_id, rfid_tag, scan_timestamp, gate_direction, entry_status, flagged, school_id) VALUES
(1, 1, 'RFID-BH-001', '2026-07-28 08:15:00', 'OUT', 'In-Bounds',  0, 1),
(1, 1, 'RFID-BH-001', '2026-07-28 18:30:00', 'IN',  'In-Bounds',  0, 1),
(2, 1, 'RFID-BH-002', '2026-07-28 07:45:00', 'OUT', 'In-Bounds',  0, 1),
(2, 1, 'RFID-BH-002', '2026-07-28 22:45:00', 'IN',  'Late Entry', 1, 1),
(3, 1, 'RFID-BH-003', '2026-07-28 09:00:00', 'OUT', 'In-Bounds',  0, 1),
(3, 1, 'RFID-BH-003', '2026-07-28 23:15:00', 'IN',  'Late Entry', 1, 1),
(4, 1, 'RFID-BH-004', '2026-07-28 08:30:00', 'OUT', 'In-Bounds',  0, 1),
(4, 1, 'RFID-BH-004', '2026-07-28 20:00:00', 'IN',  'In-Bounds',  0, 1),
(5, 2, 'RFID-GH-001', '2026-07-28 07:30:00', 'OUT', 'In-Bounds',  0, 1),
(5, 2, 'RFID-GH-001', '2026-07-28 19:45:00', 'IN',  'In-Bounds',  0, 1),
(6, 2, 'RFID-GH-002', '2026-07-28 08:00:00', 'OUT', 'In-Bounds',  0, 1),
(6, 2, 'RFID-GH-002', '2026-07-28 22:30:00', 'IN',  'Late Entry', 1, 1);

SET FOREIGN_KEY_CHECKS=1;
