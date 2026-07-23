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

-- ==========================================
-- DEMO DATA FOR LMS USER MEDIA MODULE
-- ==========================================

-- Demo Data for Users (Faculty and Students)
INSERT IGNORE INTO users (id, name, email, password_hash, role, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 'Rahul Student', 'rahul@student.sac', '$2a$10$abcdefghijklmnopqrstuv', 'Student', NOW(), NOW(), 1, 0),
(2, 'Sneha Rao', 'sneha@student.sac', '$2a$10$abcdefghijklmnopqrstuv', 'Student', NOW(), NOW(), 1, 0),
(3, 'Arjun Singh', 'arjun@student.sac', '$2a$10$abcdefghijklmnopqrstuv', 'Student', NOW(), NOW(), 1, 0),
(101, 'School Admin', 'teacher@school.sac', '$2a$10$abcdefghijklmnopqrstuv', 'Faculty', NOW(), NOW(), 1, 0);

-- Demo Data for Media Types
INSERT IGNORE INTO media_types (id, institute_id, name, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 'PDF Handout', NOW(), NOW(), 101, 0),
(2, 1, 'Lecture Video', NOW(), NOW(), 101, 0),
(3, 1, 'Slides', NOW(), NOW(), 101, 0);

-- Demo Data for Media Content
INSERT IGNORE INTO media_content (id, institute_id, title, media_type_id, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 'Physics Lab Guide', 1, NOW(), NOW(), 101, 0),
(2, 1, 'Introduction to Binary Trees', 2, NOW(), NOW(), 101, 0);

-- Demo Data for Student Media tracking
INSERT IGNORE INTO student_media_content (id, institute_id, user_id, media_content_id, accessed_date, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 1, 1, CURRENT_TIMESTAMP, NOW(), NOW(), 1, 0),
(2, 1, 2, 2, CURRENT_TIMESTAMP, NOW(), NOW(), 2, 0);

-- Demo Data for Student Assignment Submissions (user-media side tracking)
INSERT IGNORE INTO student_assignment_submissions (id, institute_id, student_id, assignment_id, submission_file_path, submission_file_name, submission_link, student_notes, submitted_date, status_id, marks_obtained, feedback_file_path, feedback_file_name, rubric_accuracy, rubric_completeness, rubric_presentation, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 1, 1, 'gravitation_report.pdf', 'gravitation_report.pdf', 'https://github.com/rahul/gravitation', 'My Lab report is attached. Answers are solved.', NOW(), 2, 45.00, 'graded_feedback.pdf', 'graded_feedback.pdf', 9, 9, 9, NOW(), NOW(), 101, 0),
(2, 1, 2, 2, 'bst_index.js', 'bst_index.js', 'https://github.com/sneha/bst', 'BST completed. Attached is index.js.', NOW(), 1, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW(), 2, 0);