-- Live Classes Scheduling Table
CREATE TABLE IF NOT EXISTS live_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    class_id INT NOT NULL,
    section_id INT NOT NULL,
    subject_id INT NOT NULL,
    topic VARCHAR(150) NOT NULL,
    description TEXT DEFAULT NULL,
    date_of_class DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    meeting_id VARCHAR(100) DEFAULT NULL,
    password VARCHAR(100) DEFAULT NULL,
    provider ENUM('zoom', 'jitsi', 'google_meet') NOT NULL DEFAULT 'zoom',
    status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
    host_id INT NOT NULL, -- References the host user (teacher)
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Indexes (User references indexed only, no foreign key constraint)
    KEY idx_live_classes_host_id (host_id),
    KEY idx_live_classes_class_section (class_id, section_id)
);

-- Class Recordings Table (Associated with scheduled live classes)
CREATE TABLE IF NOT EXISTS class_recordings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    live_class_id INT NOT NULL,
    recording_title VARCHAR(150) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    duration_seconds INT DEFAULT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    publish_status ENUM('draft', 'published', 'restricted') DEFAULT 'draft',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Key constraints (Internal referencing is allowed)
    CONSTRAINT fk_class_recordings_live_class_id FOREIGN KEY (live_class_id) REFERENCES live_classes(id) ON DELETE CASCADE,
    KEY idx_class_recordings_live_class_id (live_class_id)
);
