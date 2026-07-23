-- Assignment Status Lookup Table
CREATE TABLE IF NOT EXISTS assignment_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE, -- pending, completed, etc.
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Assignment Details Table
CREATE TABLE IF NOT EXISTS assignments_details(
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NULL,
    subject_id INT NULL,
    semester_id INT NULL,
    batch_id INT NULL,
    title VARCHAR(150) NOT NULL,
    instructions TEXT,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    submit_date DATETIME NOT NULL, -- The deadline for the assignment
    max_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 40,
    assignment_type VARCHAR(100) DEFAULT 'Written Essay',
    allowed_file_types VARCHAR(255) DEFAULT 'pdf, zip, docx',
    max_file_size INT DEFAULT 10,
    allow_late_submission TINYINT(1) DEFAULT 1,
    portal_mode VARCHAR(50) DEFAULT 'College',
    school_class VARCHAR(50) NULL,
    school_section VARCHAR(100) NULL, -- Stores Group (e.g. Computer Science)
    school_term VARCHAR(50) NULL,
    school_grading_scale VARCHAR(50) NULL,
    parent_signature_required TINYINT(1) DEFAULT 0,
    status_id INT DEFAULT 1,       -- Points to assignment_statuses(id)
    created_at DATETIME,
    updated_at DATETIME,
    updated_by INT UNSIGNED,
    is_deleted INT DEFAULT 0,

    -- Foreign Keys
    FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE SET NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS student_assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    status_id INT DEFAULT 1,
    submitted_date DATETIME DEFAULT NULL,
    submission_file_path VARCHAR(255) DEFAULT NULL COMMENT 'Path to the submitted assignment PDF/file',
    submission_file_name VARCHAR(150) DEFAULT NULL COMMENT 'Name of the submitted assignment file',
    submission_link VARCHAR(255) DEFAULT NULL COMMENT 'Submitted URL/link (GitHub, Drive, etc.)',
    student_notes TEXT DEFAULT NULL COMMENT 'Additional submission details or notes from student',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by INT UNSIGNED,
    is_deleted INT DEFAULT 0,

    -- Foreign Keys
    FOREIGN KEY (assignment_id) REFERENCES assignments_details(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Student Assignment Review / Grading Table
CREATE TABLE IF NOT EXISTS student_assignment_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_assignment_id INT NOT NULL,
    remarks TEXT NOT NULL, 
    marks_obtained DECIMAL(5,2) DEFAULT NULL COMMENT 'Marks/score awarded by the teacher',
    feedback_file_path VARCHAR(255) DEFAULT NULL COMMENT 'Path to the teacher feedback/review attachment file',
    feedback_file_name VARCHAR(150) DEFAULT NULL COMMENT 'Name of the teacher feedback attachment file',
    rubric_accuracy INT DEFAULT NULL COMMENT 'Rubric score for Accuracy (1-10)',
    rubric_completeness INT DEFAULT NULL COMMENT 'Rubric score for Completeness (1-10)',
    rubric_presentation INT DEFAULT NULL COMMENT 'Rubric score for Presentation (1-10)',
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by INT UNSIGNED,
    is_deleted INT DEFAULT 0,

    -- Foreign Keys
    FOREIGN KEY (student_assignment_id) REFERENCES student_assignment(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);
