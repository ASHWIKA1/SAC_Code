-- Users 
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Faculty', 'Student') NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Media Types 
CREATE TABLE IF NOT EXISTS media_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Student Media Tracking
CREATE TABLE IF NOT EXISTS student_media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    media_content_id INT NOT NULL,
    accessed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    KEY idx_student_media_content_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Media Content Table
CREATE TABLE IF NOT EXISTS media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    media_type_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',
    
    -- Foreign Key constraints
    CONSTRAINT fk_media_content_media_type_id FOREIGN KEY (media_type_id) REFERENCES media_types(id) ON DELETE RESTRICT
);

-- Student Assignment Submissions Tracking
CREATE TABLE IF NOT EXISTS student_assignment_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    assignment_id INT NOT NULL,
    submission_file_path VARCHAR(255) DEFAULT NULL COMMENT 'Path to the submitted assignment PDF/file',
    submission_file_name VARCHAR(150) DEFAULT NULL COMMENT 'Name of the submitted assignment file',
    submission_link VARCHAR(255) DEFAULT NULL COMMENT 'Submitted URL/link (GitHub, Drive, etc.)',
    student_notes TEXT DEFAULT NULL COMMENT 'Additional submission details or notes from student',
    submitted_date DATETIME DEFAULT NULL,
    status_id INT DEFAULT 1,
    marks_obtained DECIMAL(5,2) DEFAULT NULL COMMENT 'Marks/score awarded by the teacher',
    feedback_file_path VARCHAR(255) DEFAULT NULL COMMENT 'Path to the teacher feedback/review attachment file',
    feedback_file_name VARCHAR(150) DEFAULT NULL COMMENT 'Name of the teacher feedback attachment file',
    rubric_accuracy INT DEFAULT NULL COMMENT 'Rubric score for Accuracy (1-10)',
    rubric_completeness INT DEFAULT NULL COMMENT 'Rubric score for Completeness (1-10)',
    rubric_presentation INT DEFAULT NULL COMMENT 'Rubric score for Presentation (1-10)',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys and Indexes
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_student_assignment_submissions_student_id (student_id),
    KEY idx_student_assignment_submissions_assignment_id (assignment_id)
);