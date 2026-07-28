-- Alter existing tables to add enhanced parameters
ALTER TABLE assignments_details ADD COLUMN batch VARCHAR(50) NULL;
ALTER TABLE assignments_details ADD COLUMN semester VARCHAR(50) NULL;
ALTER TABLE assignments_details ADD COLUMN total_marks INT NULL;
ALTER TABLE assignments_details ADD COLUMN passing_marks INT NULL;
ALTER TABLE assignments_details ADD COLUMN assignment_type VARCHAR(50) NULL;
ALTER TABLE assignments_details ADD COLUMN allowed_file_types VARCHAR(150) NULL;
ALTER TABLE assignments_details ADD COLUMN max_file_size INT NULL;
ALTER TABLE assignments_details ADD COLUMN allow_late_submission TINYINT(1) DEFAULT 1;

ALTER TABLE student_assignment ADD COLUMN file_url VARCHAR(255) NULL;
ALTER TABLE student_assignment ADD COLUMN submission_text TEXT NULL;

-- Create AI Question History
CREATE TABLE IF NOT EXISTS ai_question_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    bloom_level VARCHAR(20) NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Generated Questions
CREATE TABLE IF NOT EXISTS generated_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    history_id INT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(20),
    topic VARCHAR(100),
    bloom_level VARCHAR(20),
    suggested_marks INT,
    FOREIGN KEY (history_id) REFERENCES ai_question_history(id) ON DELETE CASCADE
);

-- Create Discussion Groups Table
CREATE TABLE IF NOT EXISTS discussion_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    created_by_faculty INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '1 = Trashed from UI list',
    
    FOREIGN KEY (created_by_faculty) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
    group_id INT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES discussion_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Assignment Evaluation Table
CREATE TABLE IF NOT EXISTS assignment_evaluation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_assignment_id INT NOT NULL,
    score INT NOT NULL,
    remarks TEXT,
    needs_resubmission TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_assignment_id) REFERENCES student_assignment(id) ON DELETE CASCADE
);
