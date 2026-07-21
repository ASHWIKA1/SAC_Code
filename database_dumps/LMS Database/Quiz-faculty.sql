-- Main Quizzes Table (Matches your schedule view data fields)
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    course_id INT NOT NULL,
    exam_type INT DEFAULT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT DEFAULT NULL,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('draft', 'scheduled', 'published', 'completed', 'withdrawn') DEFAULT 'draft',
    status_id INT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    CONSTRAINT fk_quizzes_status_id FOREIGN KEY (status_id) REFERENCES quiz_statuses(id)
);

-- Question Bank Table (Stores MCQ/True-False options as JSON for query speed and efficiency)
CREATE TABLE IF NOT EXISTS question_bank (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    subject_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('mcq', 'true_false', 'descriptive') DEFAULT 'mcq', 
    import_method ENUM('manual_entry', 'ai_generated', 'bulk_import') DEFAULT 'manual_entry',
    complexity ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    marks DOUBLE NOT NULL DEFAULT 1.0,
    question_options_json JSON DEFAULT NULL COMMENT 'MCQ/True-False options stored as JSON for high data handling speed',
    correct_answer TEXT DEFAULT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Quiz to Question Assignment Mapping Table (With snapshot caching for performance and data isolation)
CREATE TABLE IF NOT EXISTS quiz_questions_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('mcq', 'true_false', 'descriptive') DEFAULT 'mcq', 
    marks DOUBLE NOT NULL,
    complexity ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    negative_marks DOUBLE DEFAULT 0,
    correct_answer TEXT DEFAULT NULL,
    options_json JSON DEFAULT NULL COMMENT 'Copy of options at time of assignment for historical data integrity',
    status INT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    CONSTRAINT fk_quiz_questions_mapping_quiz_id FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_questions_mapping_question_id FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
    KEY idx_quiz_questions_mapping_quiz_id (quiz_id),
    KEY idx_quiz_questions_mapping_question_id (question_id)
);
