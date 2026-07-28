-- Table: Batches
CREATE TABLE IF NOT EXISTS batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL UNIQUE,
    start_year INT NULL,
    end_year INT NULL,
    active_status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Table: Course Batches Mapping (Connects Courses and Batches)
CREATE TABLE IF NOT EXISTS course_batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    batch_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    UNIQUE KEY uq_course_batch (course_id, batch_id)
);

-- Insert Sample Batches
INSERT INTO batches (id, batch_name, start_year, end_year) VALUES
(1, '2026 Batch', 2022, 2026),
(2, '2027 Batch', 2023, 2027)
ON DUPLICATE KEY UPDATE batch_name=VALUES(batch_name);

-- Insert Sample Course Batches Mappings
INSERT INTO course_batches (course_id, batch_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 1),
(4, 2)
ON DUPLICATE KEY UPDATE course_id=course_id;
