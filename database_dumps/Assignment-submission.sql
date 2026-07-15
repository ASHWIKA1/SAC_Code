-- Assignment Status Lookup Table
CREATE TABLE IF NOT EXISTS assignment_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE, -- pending, completed, etc.
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Assignment Details Table
CREATE TABLE IF NOT EXISTS assignments_details(
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,     -- Will link to your future courses table
    subject_id INT NOT NULL,    -- Will link to your future subjects table
    title VARCHAR(150) NOT NULL,
    instructions TEXT,
    submit_date DATETIME NOT NULL, -- The deadline for the assignment
    status_id INT DEFAULT 1,       -- Points to assignment_statuses(id)
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    status_id INT DEFAULT 1,
    submitted_date DATETIME DEFAULT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_user INT,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys (Notice there is NO comma after the last constraint here)
    CONSTRAINT fk_student_assignment_assignment_id FOREIGN KEY (assignment_id) REFERENCES assignments_details(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_assignment_student_id FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_assignment_status_id FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT
);
-- Student Assignment Review / Grading Table
CREATE TABLE IF NOT EXISTS student_assignment_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    CONSTRAINT fk_student_assignment_review_faculty_id FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE
);
