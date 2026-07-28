-- Flyway Migration script for LMS quizzes, forums, and live classes tables

-- 1. Create Quizzes table
CREATE TABLE IF NOT EXISTS lms_quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    duration INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    assigned_class VARCHAR(50) NOT NULL,
    assigned_section VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0
);

-- 2. Create Quiz Questions table
CREATE TABLE IF NOT EXISTS lms_quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options TEXT, -- JSON serialized array of options
    correct TEXT, -- Correct answer (index or array of indices)
    image_url VARCHAR(255) NULL,
    FOREIGN KEY (quiz_id) REFERENCES lms_quizzes(id) ON DELETE CASCADE
);

-- 3. Create Quiz Attempts table
CREATE TABLE IF NOT EXISTS lms_quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    score INT NULL,
    evaluated TINYINT(1) DEFAULT 0,
    remarks TEXT NULL,
    answers TEXT NULL, -- JSON serialized string of student answers map
    submitted_date DATETIME DEFAULT NULL,
    allowed_reattempt TINYINT(1) DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES lms_quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create Forums table
CREATE TABLE IF NOT EXISTS lms_forums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Forum Posts/Messages table
CREATE TABLE IF NOT EXISTS lms_forum_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES lms_forums(id) ON DELETE CASCADE
);

-- 6. Create Live Classes table
CREATE TABLE IF NOT EXISTS lms_live_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NULL,
    title VARCHAR(255) NOT NULL,
    date_time DATETIME NOT NULL,
    duration INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    meeting_url VARCHAR(255) NULL,
    recording_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
