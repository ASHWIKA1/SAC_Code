-- Table: Courses
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL UNIQUE,
    course_code VARCHAR(50) NULL,
    description TEXT,
    active_status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0
);

-- Insert Sample Courses
INSERT INTO courses (id, course_name, course_code, description) VALUES
(1, 'Physics Class XI - Mechanics', 'PHYS-101', 'Introductory class on Mechanics and Planetary orbits.'),
(2, 'Computer Science - Data Structures', 'CS-201', 'Core computer science course covering fundamental structures like Trees, Stacks, Queues.'),
(3, 'Advanced Calculus (MATH-302)', 'MATH-302', 'Double integrals, vector calculus and polar co-ordinate derivatives.'),
(4, 'Chemistry Class XII - Organic Chemistry', 'CHEM-102', 'In depth study of Organic chemistry, chains and reactions.')
ON DUPLICATE KEY UPDATE course_name=VALUES(course_name);
