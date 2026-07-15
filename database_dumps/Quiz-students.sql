-- 1. Quiz Attempts Table
-- Tracks overall performance, total scores, and structural status (Completed/InProgress)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    quiz_id INT NOT NULL,
    user_id INT NOT NULL,
    attempt_number INT DEFAULT 1,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at DATETIME DEFAULT NULL,
    max_marks DOUBLE DEFAULT 0,
    obtain_marks DOUBLE DEFAULT 0,
    obtained_negative_marks DOUBLE DEFAULT 0,
    count_of_correct_answers INT DEFAULT 0,
    count_of_incorrect_answers INT DEFAULT 0,
    count_of_unanswered INT DEFAULT 0,
    score_achieved DECIMAL(5,2) DEFAULT NULL,
    faculty_remarks TEXT DEFAULT NULL,
    is_allowed_reattempt TINYINT(1) DEFAULT 0 COMMENT '1 = Technical Exception Allowed',
    reattempt_granted_by INT DEFAULT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    CONSTRAINT fk_quiz_attempts_quiz_id FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_reattempt_granted_by FOREIGN KEY (reattempt_granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY idx_quiz_attempts_quiz_user_attempt (quiz_id, user_id, attempt_number)
);

-- 2. Student Question Interactions Table (The Analytics Core)
-- Tracks individual responses, skipping behavior, and "Mark for Review" status
CREATE TABLE IF NOT EXISTS student_quiz_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    quiz_attempt_id INT NOT NULL,
    quiz_question_mapping_id INT NOT NULL,
    answer_text TEXT DEFAULT NULL,
    is_answer_correct TINYINT(1) DEFAULT NULL,
    selected_option TEXT DEFAULT NULL,
    user_action VARCHAR(100) DEFAULT NULL COMMENT 'user has skipped/attempted/not-attempted/mark-for-review',
    marks_obtained DOUBLE DEFAULT 0,
    obtained_negative_marks DOUBLE DEFAULT 0,
    time_spent_seconds INT DEFAULT 0 COMMENT 'Analytics tracking per question',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    CONSTRAINT fk_student_quiz_responses_quiz_attempt_id FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_quiz_responses_quiz_question_mapping_id FOREIGN KEY (quiz_question_mapping_id) REFERENCES quiz_questions_mapping(id) ON DELETE CASCADE,
    UNIQUE KEY idx_student_quiz_responses_attempt_question (quiz_attempt_id, quiz_question_mapping_id)
);

-- View Upcoming Quizzes
SELECT * FROM quizzes 
WHERE start_date_time > NOW() AND status = 'scheduled'; 

-- Analytics: Find out which questions took students the longest time to process
SELECT quiz_question_mapping_id, AVG(time_spent_seconds) as avg_time 
FROM student_quiz_responses 
GROUP BY quiz_question_mapping_id;

-- Analytics: Find how many students accessed (attempted) a quiz and get their details
SELECT 
    qa.quiz_id,
    q.title AS quiz_title,
    COUNT(DISTINCT qa.user_id) AS total_students_accessed,
    u.id AS student_id,
    u.name AS student_name,
    u.email AS student_email,
    qa.started_at,
    qa.submitted_at,
    qa.score_achieved
FROM quiz_attempts qa
JOIN quizzes q ON qa.quiz_id = q.id
JOIN users u ON qa.user_id = u.id
GROUP BY qa.quiz_id, qa.user_id;