-- Attendance Analytics Table
CREATE TABLE IF NOT EXISTS student_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    user_id INT NOT NULL,
    academic_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    UNIQUE KEY idx_student_attendance_user_date (user_id, academic_date),
    KEY idx_student_attendance_user_id (user_id)
);

-- Behavioral Index Tracking Table 
CREATE TABLE IF NOT EXISTS student_behavior_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    user_id INT NOT NULL,
    recorded_week_start DATE NOT NULL COMMENT 'Tracks the Monday date of W1, W2, W3, W4...',
    behavior_score TINYINT NOT NULL COMMENT 'Scale from 1 to 5 as shown on UI chart',
    faculty_remarks VARCHAR(255) DEFAULT NULL,
    logged_by_faculty INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    KEY idx_student_behavior_logs_user_id (user_id),
    KEY idx_student_behavior_logs_logged_by_faculty (logged_by_faculty)
);

-- Parent-Student Mapping Relationship Table
CREATE TABLE IF NOT EXISTS parent_student_relations (
    institute_id INT NOT NULL,
    parent_id INT NOT NULL,
    user_id INT NOT NULL,
    relationship_type VARCHAR(30) DEFAULT 'Parent' COMMENT 'Father, Mother, Guardian, etc.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    PRIMARY KEY (parent_id, user_id),
    KEY idx_parent_student_relations_parent_id (parent_id),
    KEY idx_parent_student_relations_user_id (user_id)
);

SELECT 
    MONTHNAME(academic_date) AS month_name,
    (COUNT(CASE WHEN status = 'present' THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage
FROM student_attendance
WHERE user_id = 5 
GROUP BY MONTHNAME(academic_date), MONTH(academic_date)
ORDER BY MONTH(academic_date);

SELECT 
    recorded_week_start,
    AVG(behavior_score) AS weekly_average_score
FROM student_behavior_logs
WHERE user_id = 5
GROUP BY recorded_week_start
ORDER BY recorded_week_start;