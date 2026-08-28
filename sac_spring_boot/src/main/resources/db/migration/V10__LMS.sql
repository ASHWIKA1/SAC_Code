-- Users 
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(50) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Faculty', 'Student') NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media Types 
CREATE TABLE IF NOT EXISTS media_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_user INT UNSIGNED,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',
    FOREIGN KEY (updated_by_user) REFERENCES users(id) ON DELETE SET NULL
);

-- Media Content Table
CREATE TABLE IF NOT EXISTS media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    media_type_id INT NOT NULL,
    status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_user INT UNSIGNED,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',
    -- Foreign Key constraints
    FOREIGN KEY (media_type_id) REFERENCES media_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by_user) REFERENCES users(id) ON DELETE SET NULL
);

-- Student Media Tracking
CREATE TABLE IF NOT EXISTS student_media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    media_content_id INT NOT NULL,
    accessed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (media_content_id) REFERENCES media_content(id) ON DELETE CASCADE
);

-- Assignment Status Lookup Table
CREATE TABLE IF NOT EXISTS assignment_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE, -- pending, completed, etc.
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0
);

-- Assignment Details Table
CREATE TABLE IF NOT EXISTS assignments_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,     -- Will link to your future courses table
    subject_id INT NOT NULL,    -- Will link to your future subjects table
    title VARCHAR(150) NOT NULL,
    instructions TEXT,
    submit_date DATETIME NOT NULL, -- The deadline for the assignment
    status_id INT DEFAULT 1,       -- Points to assignment_statuses(id)
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_user INT UNSIGNED,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys
    FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by_user) REFERENCES users(id) ON DELETE SET NULL
);

-- Student Assignment Table
CREATE TABLE IF NOT EXISTS student_assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    status_id INT DEFAULT 1,
    submitted_date DATETIME DEFAULT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_user INT UNSIGNED,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys
    FOREIGN KEY (assignment_id) REFERENCES assignments_details(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES assignment_statuses(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by_user) REFERENCES users(id) ON DELETE SET NULL
);

-- Student Assignment Review / Grading Table
CREATE TABLE IF NOT EXISTS student_assignment_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_assignment_id INT NOT NULL,
    remarks TEXT NOT NULL, 
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    faculty_id INT UNSIGNED NOT NULL, 
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '0 = Alive, 1 = Soft Deleted',

    -- Foreign Keys
    FOREIGN KEY (student_assignment_id) REFERENCES student_assignment(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE
);
