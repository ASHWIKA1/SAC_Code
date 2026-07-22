-- Users 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
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
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Student Media Tracking
CREATE TABLE IF NOT EXISTS student_media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    media_content_id INT NOT NULL,
    accessed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Media Content Table
CREATE TABLE IF NOT EXISTS media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    media_type_id INT NOT NULL,
    status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    -- Foreign Key constraints
    FOREIGN KEY (media_type_id) REFERENCES media_types(id) ON DELETE RESTRICT
);