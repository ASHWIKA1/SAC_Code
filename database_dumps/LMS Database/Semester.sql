-- Table: Semesters
CREATE TABLE IF NOT EXISTS semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_name VARCHAR(50) NOT NULL UNIQUE,
    active_status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Table: Course Semesters Mapping (Connects Courses and Semesters)
CREATE TABLE IF NOT EXISTS course_semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    semester_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    UNIQUE KEY uq_course_semester (course_id, semester_id)
);

-- Insert Sample Semesters
INSERT INTO semesters (id, semester_name) VALUES
(1, 'Semester 1'),
(2, 'Semester 2')
ON DUPLICATE KEY UPDATE semester_name=VALUES(semester_name);

-- Insert Sample Course Semesters Mappings
INSERT INTO course_semesters (course_id, semester_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 1),
(4, 2)
ON DUPLICATE KEY UPDATE course_id=course_id;
