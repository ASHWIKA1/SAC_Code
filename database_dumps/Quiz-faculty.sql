-- Quiz Statuses
CREATE TABLE IF NOT EXISTS quiz_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(30) NOT NULL UNIQUE,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

INSERT IGNORE INTO quiz_statuses (id, status_name) VALUES 
(1, 'Pending'), (2, 'Published'), (3, 'Completed'), (4, 'Withdrawn');

-- Main Quizzes Table (Matches your schedule view data fields)
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status_id INT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    FOREIGN KEY (status_id) REFERENCES quiz_statuses(id)
);

-- Question Bank Master Table (Tracks the custom Import Methods from your UI)
CREATE TABLE IF NOT EXISTS question_bank (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'Single Choice MCQ', 
    import_method VARCHAR(50) DEFAULT 'Manual Entry',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Dynamic Options Table (Stores Options A, B, C, D text fields)
CREATE TABLE IF NOT EXISTS question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_label CHAR(1) NOT NULL,
    option_text TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
);

-- Quiz to Question Assignment Mapping Bridge Table
CREATE TABLE IF NOT EXISTS quiz_questions_mapping (
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    PRIMARY KEY (quiz_id, question_id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
);

-- ==========================================
-- DEMO DATA FOR LMS QUIZ FACULTY MODULE
-- ==========================================

-- Demo Data for Quizzes
INSERT IGNORE INTO quizzes (id, title, start_date_time, end_date_time, duration_minutes, status_id, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 'Midterm Physics Quiz', NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY), 30, 2, NOW(), NOW(), 101, 0),
(2, 'Data Structures MCQ', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 45, 2, NOW(), NOW(), 101, 0);

-- Demo Data for Question Bank
INSERT IGNORE INTO question_bank (id, question_text, question_type, import_method, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 'What is the value of acceleration due to gravity on Earth?', 'Single Choice MCQ', 'Manual Entry', NOW(), NOW(), 101, 0),
(2, 'What is the time complexity of searching in a balanced Binary Search Tree?', 'Single Choice MCQ', 'Manual Entry', NOW(), NOW(), 101, 0);

-- Demo Data for Question Options
INSERT IGNORE INTO question_options (id, question_id, option_label, option_text, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, 'A', '9.8 m/s^2', NOW(), NOW(), 101, 0),
(2, 1, 'B', '10.5 m/s^2', NOW(), NOW(), 101, 0),
(3, 1, 'C', '8.9 m/s^2', NOW(), NOW(), 101, 0),
(4, 1, 'D', '7.6 m/s^2', NOW(), NOW(), 101, 0),
(5, 2, 'A', 'O(N)', NOW(), NOW(), 101, 0),
(6, 2, 'B', 'O(log N)', NOW(), NOW(), 101, 0),
(7, 2, 'C', 'O(N log N)', NOW(), NOW(), 101, 0),
(8, 2, 'D', 'O(1)', NOW(), NOW(), 101, 0);

-- Demo Data for Quiz Question Mappings
INSERT IGNORE INTO quiz_questions_mapping (quiz_id, question_id, created_at, updated_at, updated_by, is_deleted) VALUES
(1, 1, NOW(), NOW(), 101, 0),
(2, 2, NOW(), NOW(), 101, 0);
