-- Create parent_student_mappings table
CREATE TABLE IF NOT EXISTS parent_student_mappings (
    parent_id INT UNSIGNED NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (parent_id, student_id),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert mock parent-student relationships matching existing users
-- Map Kieran (id 39, Parent) -> Eriberto (id 38, Student)
-- Map Winston (id 41, Parent) -> Blaise (id 40, Student)
-- Map Quinton (id 43, Parent) -> Josiah (id 42, Student)
-- Map Antwan (id 45, Parent) -> Clemens (id 44, Student)
INSERT IGNORE INTO parent_student_mappings (parent_id, student_id) VALUES 
(39, 38),
(41, 40),
(43, 42),
(45, 44);
