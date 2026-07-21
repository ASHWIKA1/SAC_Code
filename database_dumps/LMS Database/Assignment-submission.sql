-- Assignment Status Lookup Table
CREATE TABLE IF NOT EXISTS assignment_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    status_name VARCHAR(50) NOT NULL UNIQUE, -- pending, completed, etc.
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Assignment Details Table
CREATE TABLE IF NOT EXISTS assignments_details(
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    course_id INT NOT NULL,     -- Will link to your future courses table
    subject_id INT NOT NULL,    -- Will link to your future subjects table
    title VARCHAR(150) NOT NULL,
    instructions TEXT,
    submit_date DATETIME NOT NULL, -- The deadline for the assignment
    status_id INT DEFAULT 1,       -- Points to assignment_statuses(id)
    updated_by_user INT,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys
    CONSTRAINT fk_assignments_details_status_id FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS student_assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    assignment_id INT NOT NULL,
    user_id INT NOT NULL,
    status_id INT DEFAULT NULL,
    submitted_date DATETIME DEFAULT NULL,
    updated_by_user INT,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys (Notice there is NO comma after the last constraint here)
    CONSTRAINT fk_student_assignment_assignment_id FOREIGN KEY (assignment_id) REFERENCES assignments_details(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_assignment_status_id FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT,
    KEY idx_student_assignment_user_id (user_id)
);
-- Student Assignment Review / Grading Table
CREATE TABLE IF NOT EXISTS student_assignment_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    student_assignment_id INT NOT NULL,
    remarks TEXT NOT NULL, 
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    faculty_id INT NOT NULL, 
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys
    CONSTRAINT fk_student_assignment_review_student_assignment_id FOREIGN KEY (student_assignment_id) REFERENCES student_assignment(id) ON DELETE CASCADE,
    KEY idx_student_assignment_review_faculty_id (faculty_id)
);
