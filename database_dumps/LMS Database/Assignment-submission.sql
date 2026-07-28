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
    updated_by BIGINT,
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
    updated_by BIGINT,
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
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,

    -- Foreign Keys
    FOREIGN KEY (student_assignment_id) REFERENCES student_assignment(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- DEMO DATA FOR LMS ASSIGNMENT MODULE
-- ==========================================

-- Demo Data for Assignment Statuses
INSERT IGNORE INTO assignment_statuses (id, status_name, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 'Pending', NOW(), NOW(), 101, 0),
(2, 'Graded', NOW(), NOW(), 101, 0);

-- Demo Data for Assignment Details (Newtonian Gravitation Lab and BST)
INSERT IGNORE INTO assignments_details (id, course_id, subject_id, semester_id, batch_id, title, instructions, start_date, end_date, submit_date, max_marks, passing_marks, assignment_type, allowed_file_types, max_file_size, allow_late_submission, portal_mode, school_class, school_section, school_term, school_grading_scale, parent_signature_required, status_id, created_at, updated_at, updated_by, is_deleted) VALUES
(1, NULL, NULL, NULL, NULL, 'Newtonian Gravitation Lab', 'Solve problems 1-10 on planetary mechanics.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 50, 20, 'Written Essay', 'pdf, zip, docx', 10, 1, 'School', 'Class XI', 'Physics Class XI - Mechanics', 'Term I', 'Marks', 0, 1, NOW(), NOW(), 101, 0),
(2, NULL, NULL, NULL, NULL, 'Binary Search Trees Implementation', 'Implement BST insertion, deletion, and traversal in JS/Java.', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 100, 40, 'Written Essay', 'pdf, zip, docx', 10, 1, 'School', 'Class XI', 'Computer Science - Data Structures', 'Term I', 'Marks', 0, 1, NOW(), NOW(), 101, 0);

-- Demo Data for Student Assignment
INSERT IGNORE INTO student_assignment (id, assignment_id, student_id, status_id, submitted_date, submission_file_path, submission_file_name, submission_link, student_notes, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 1, 2, NOW(), 'gravitation_report.pdf', 'gravitation_report.pdf', 'https://github.com/rahul/gravitation', 'My Lab report is attached. Answers are solved.', NOW(), NOW(), 1, 0),
(2, 2, 2, 1, NOW(), 'bst_index.js', 'bst_index.js', 'https://github.com/sneha/bst', 'BST completed. Attached is index.js.', NOW(), NOW(), 2, 0);

-- Demo Data for Student Assignment Review / Grading
INSERT IGNORE INTO student_assignment_review (id, student_assignment_id, remarks, marks_obtained, feedback_file_path, feedback_file_name, rubric_accuracy, rubric_completeness, rubric_presentation, review_date, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 'Excellent analysis of force equations!', 45.00, 'graded_feedback.pdf', 'graded_feedback.pdf', 9, 9, 9, CURRENT_TIMESTAMP, NOW(), NOW(), 101, 0);
