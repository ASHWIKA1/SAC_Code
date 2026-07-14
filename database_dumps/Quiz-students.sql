-- 1. Quiz Attempts Table
-- Tracks overall performance, total scores, and structural status (Completed/InProgress)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    attempt_number INT DEFAULT 1,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at DATETIME DEFAULT NULL,
    score_achieved DECIMAL(5,2) DEFAULT NULL,
    faculty_remarks TEXT DEFAULT NULL,
    is_allowed_reattempt TINYINT(1) DEFAULT 0 COMMENT '1 = Technical Exception Allowed',
    reattempt_granted_by INT DEFAULT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reattempt_granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY idx_student_attempt (quiz_id, student_id, attempt_number)
);

-- 2. Student Question Interactions Table (The Analytics Core)
-- Tracks individual responses, skipping behavior, and "Mark for Review" status
CREATE TABLE IF NOT EXISTS student_quiz_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_index TINYINT DEFAULT NULL COMMENT '0-3 matching A-D, NULL if skipped',
    descriptive_answer TEXT DEFAULT NULL,
    is_marked_for_review TINYINT(1) DEFAULT 0 COMMENT '1 = Student flagged for review',
    is_skipped TINYINT(1) DEFAULT 0 COMMENT '1 = Student skipped question',
    time_spent_seconds INT DEFAULT 0 COMMENT 'Analytics tracking per question',
    is_correct TINYINT(1) DEFAULT NULL COMMENT 'Evaluated score result',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
    UNIQUE KEY idx_attempt_question (quiz_attempt_id, question_id)
);

-- View Upcoming Quizzes
SELECT * FROM quizzes 
WHERE start_date_time > NOW() AND status = 'Scheduled'; 

-- Analytics: Find out which questions took students the longest time to process
SELECT question_id, AVG(time_spent_seconds) as avg_time 
FROM student_quiz_responses 
GROUP BY question_id;

-- Analytics: Find how many students accessed (attempted) a quiz and get their details
SELECT 
    qa.quiz_id,
    q.title AS quiz_title,
    COUNT(DISTINCT qa.student_id) AS total_students_accessed,
    u.id AS student_id,
    u.name AS student_name,
    u.email AS student_email,
    qa.started_at,
    qa.submitted_at,
    qa.score_achieved
FROM quiz_attempts qa
JOIN quizzes q ON qa.quiz_id = q.id
JOIN users u ON qa.student_id = u.id
GROUP BY qa.quiz_id, qa.student_id;