-- =============================================================================
-- Flyway Migration V24: Enhanced Hostel Module Schema
-- Adds separate dedicated tables for each sub-feature of the Hostel module:
-- 1. sm_hostel_blocks        : Detailed hostel block whereabouts & locations
-- 2. sm_hostel_visitors      : Visitor digital check-in log table extension
-- 3. sm_hostel_roommates     : Explicit room bed assignment & roommate tracking
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. NEW TABLE: sm_hostel_blocks — Hostel Block Whereabouts & Location Metadata
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sm_hostel_blocks (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hostel_id       BIGINT UNSIGNED NOT NULL,
    block_code      VARCHAR(50)     NOT NULL,
    block_name      VARCHAR(191)    NOT NULL,
    whereabouts     VARCHAR(500)    NOT NULL,
    floors_count    INT             NOT NULL DEFAULT 1,
    school_id       BIGINT UNSIGNED NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_blocks_hostel FOREIGN KEY (hostel_id) REFERENCES sm_hostels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 2. ENHANCE sm_hostel_rooms — Add block_id reference and room size metadata
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS enhance_hostel_rooms_schema;
DELIMITER //
CREATE PROCEDURE enhance_hostel_rooms_schema()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_rooms' AND COLUMN_NAME = 'block_id'
    ) THEN
        ALTER TABLE sm_hostel_rooms ADD COLUMN block_id BIGINT UNSIGNED DEFAULT NULL AFTER hostel_id;
        ALTER TABLE sm_hostel_rooms ADD CONSTRAINT fk_rooms_block FOREIGN KEY (block_id) REFERENCES sm_hostel_blocks(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_rooms' AND COLUMN_NAME = 'room_size_sqft'
    ) THEN
        ALTER TABLE sm_hostel_rooms ADD COLUMN room_size_sqft INT DEFAULT 180 AFTER room_type;
    END IF;
END//
DELIMITER ;
CALL enhance_hostel_rooms_schema();
DROP PROCEDURE IF EXISTS enhance_hostel_rooms_schema;

-- ---------------------------------------------------------------------------
-- 3. ENHANCE sm_hostel_allocations — Add student details (student_name, class_name, section)
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS enhance_hostel_allocations_schema;
DELIMITER //
CREATE PROCEDURE enhance_hostel_allocations_schema()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_allocations' AND COLUMN_NAME = 'student_name'
    ) THEN
        ALTER TABLE sm_hostel_allocations ADD COLUMN student_name VARCHAR(191) DEFAULT NULL AFTER student_id;
        ALTER TABLE sm_hostel_allocations ADD COLUMN class_name VARCHAR(100) DEFAULT NULL AFTER student_name;
        ALTER TABLE sm_hostel_allocations ADD COLUMN section VARCHAR(50) DEFAULT NULL AFTER class_name;
        ALTER TABLE sm_hostel_allocations ADD COLUMN gender VARCHAR(20) DEFAULT NULL AFTER section;
    END IF;
END//
DELIMITER ;
CALL enhance_hostel_allocations_schema();
DROP PROCEDURE IF EXISTS enhance_hostel_allocations_schema;

-- ---------------------------------------------------------------------------
-- 4. ENHANCE sm_hostel_discipline_logs — Add room & floor metadata
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS enhance_hostel_discipline_schema;
DELIMITER //
CREATE PROCEDURE enhance_hostel_discipline_schema()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sm_hostel_discipline_logs' AND COLUMN_NAME = 'student_name'
    ) THEN
        ALTER TABLE sm_hostel_discipline_logs ADD COLUMN student_name VARCHAR(191) DEFAULT NULL AFTER student_id;
        ALTER TABLE sm_hostel_discipline_logs ADD COLUMN class_name VARCHAR(100) DEFAULT NULL AFTER student_name;
        ALTER TABLE sm_hostel_discipline_logs ADD COLUMN section VARCHAR(50) DEFAULT NULL AFTER class_name;
        ALTER TABLE sm_hostel_discipline_logs ADD COLUMN floor INT DEFAULT NULL AFTER section;
        ALTER TABLE sm_hostel_discipline_logs ADD COLUMN room_no VARCHAR(20) DEFAULT NULL AFTER floor;
    END IF;
END//
DELIMITER ;
CALL enhance_hostel_discipline_schema();
DROP PROCEDURE IF EXISTS enhance_hostel_discipline_schema;

-- ---------------------------------------------------------------------------
-- SEED BLOCKS DATA
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO sm_hostel_blocks (id, hostel_id, block_code, block_name, whereabouts, floors_count, school_id) VALUES
(1, 1, 'BLK-A', 'Tagore Boys Block A', 'North Campus, Near Sports Ground', 4, 1),
(2, 2, 'BLK-B', 'Saraswati Girls Block B', 'South Campus, Near Central Library', 4, 1);

UPDATE sm_hostel_rooms SET block_id = 1 WHERE hostel_id = 1;
UPDATE sm_hostel_rooms SET block_id = 2 WHERE hostel_id = 2;
