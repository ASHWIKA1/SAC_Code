-- Table: Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(150) NOT NULL,
    subject_code VARCHAR(50) NULL,
    subject_type ENUM('Theory', 'Practical') DEFAULT 'Theory',
    active_status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Table: Course Subject Details (Integrates Courses, Subjects, Semesters, and Batches)
CREATE TABLE IF NOT EXISTS course_subject_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester_id INT NOT NULL,
    batch_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    UNIQUE KEY uq_course_subject_semester_batch (course_id, subject_id, semester_id, batch_id)
);

-- Insert Sample Subjects
INSERT INTO subjects (id, subject_name, subject_code, subject_type) VALUES
(1, 'Physics', 'PHYS-101', 'Theory'),
(2, 'Chemistry', 'CHEM-101', 'Theory'),
(3, 'Biology', 'BIOL-101', 'Theory'),
(4, 'Computer Science', 'CS-201', 'Practical'),
(5, 'Mathematics', 'MATH-101', 'Theory'),
(6, 'English', 'ENGL-101', 'Theory'),
(7, 'History', 'HIST-101', 'Theory'),
(8, 'Geography', 'GEOG-101', 'Theory'),
(9, 'Accountancy', 'ACCT-101', 'Theory'),
(10, 'Business Studies', 'BUSS-101', 'Theory'),
(11, 'Economics', 'ECON-101', 'Theory'),
(12, 'Computer Applications', 'COMP-101', 'Practical')
ON DUPLICATE KEY UPDATE subject_name=VALUES(subject_name);

-- Insert Sample Integrated Course-Subject-Semester-Batch Mapping Details
INSERT INTO course_subject_details (course_id, subject_id, semester_id, batch_id) VALUES
(1, 1, 1, 1), -- Physics Class XI, Physics, Sem 1, Batch 2026
(1, 2, 1, 1), -- Physics Class XI, Chemistry, Sem 1, Batch 2026
(2, 4, 1, 1), -- CS Data Structures, Computer Science, Sem 1, Batch 2026
(3, 5, 1, 1)  -- Advanced Calculus, Mathematics, Sem 1, Batch 2026
ON DUPLICATE KEY UPDATE course_id=course_id;
