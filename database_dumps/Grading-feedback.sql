-- Grading Scales Table
CREATE TABLE IF NOT EXISTS grading_scales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    grade_name VARCHAR(20) NOT NULL,
    min_percentage DOUBLE NOT NULL,
    max_percentage DOUBLE NOT NULL,
    gpa_point DOUBLE NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    active_status TINYINT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted'
);

-- Student Feedbacks Table (Tracks academic and behavioral reviews)
CREATE TABLE IF NOT EXISTS student_feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    user_id INT NOT NULL, -- References student in external users table
    faculty_id INT NOT NULL, -- References faculty in external users table
    course_id INT NOT NULL,
    subject_id INT NOT NULL,
    feedback_type ENUM('academic', 'behavioral', 'general') DEFAULT 'general',
    remarks TEXT NOT NULL,
    grade_scale_id INT DEFAULT NULL, -- Points to grading_scales(id)
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys (Internal only)
    CONSTRAINT fk_student_feedbacks_grade_scale_id FOREIGN KEY (grade_scale_id) REFERENCES grading_scales(id) ON DELETE SET NULL,
    
    -- Indexes for user mapping references
    KEY idx_student_feedbacks_user_id (user_id),
    KEY idx_student_feedbacks_faculty_id (faculty_id),
    KEY idx_student_feedbacks_grade_scale_id (grade_scale_id)
);
