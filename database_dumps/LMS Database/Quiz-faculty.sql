-- Quiz Statuses
CREATE TABLE IF NOT EXISTS quiz_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(30) NOT NULL UNIQUE
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
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
);

-- Quiz to Question Assignment Mapping Bridge Table
CREATE TABLE IF NOT EXISTS quiz_questions_mapping (
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    PRIMARY KEY (quiz_id, question_id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
);
