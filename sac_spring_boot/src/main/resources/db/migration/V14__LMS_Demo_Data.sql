-- V14__LMS_Demo_Data.sql
-- Flyway migration to seed realistic demo data for LMS Assignments and Quizzes

-- 1. Insert users if they do not exist
INSERT IGNORE INTO users (id, name, email, username, password, role_id) VALUES
(2, 'Rahul Student', 'rahul@student.sac', 'rahul', '$2a$10$abcdefghijklmnopqrstuv', 2),
(3, 'Sneha Rao', 'sneha@student.sac', 'sneha', '$2a$10$abcdefghijklmnopqrstuv', 2),
(4, 'Arjun Singh', 'arjun@student.sac', 'arjun', '$2a$10$abcdefghijklmnopqrstuv', 2),
(101, 'School Admin', 'teacher@school.sac', 'teacher', '$2a$10$abcdefghijklmnopqrstuv', 9);

-- 2. Insert student details mapping users to student list
INSERT IGNORE INTO sm_students (id, admission_no, roll_no, first_name, last_name, full_name, email, user_id, class_id, section_id, school_id, academic_id, active_status) VALUES
(1, 10001, 1, 'Rahul', 'Student', 'Rahul Student', 'rahul@student.sac', 2, 1, 1, 1, 1, 1),
(2, 10002, 2, 'Sneha', 'Rao', 'Sneha Rao', 'sneha@student.sac', 3, 1, 1, 1, 1, 1),
(3, 10003, 3, 'Arjun', 'Singh', 'Arjun Singh', 'arjun@student.sac', 4, 1, 1, 1, 1, 1);

-- 3. Seed homework data (using IDs 1001 and 1002 to avoid conflicts with V7 seed data)
INSERT IGNORE INTO sm_homeworks (id, homework_date, submission_date, evaluation_date, file, marks, description, active_status, title, instructions, start_date, end_date, max_marks, passing_marks, assignment_type, allowed_file_types, max_file_size, allow_late_submission, portal_mode, school_class, school_section, school_term, school_grading_scale, parent_signature_required, status_id) VALUES
(1001, '2026-07-23', '2026-07-30', '2026-07-30', 'gravitation_report.pdf', '50', 'Newtonian Gravitation Lab', 1, 'Newtonian Gravitation Lab', 'Solve problems 1-10 on planetary mechanics.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 50, 20, 'Written Essay', 'pdf, zip, docx', 10, 1, 'School', 'Class XI', 'Physics Class XI - Mechanics', 'Term I', 'Marks', 0, 1),
(1002, '2026-07-23', '2026-07-28', '2026-07-28', 'bst_index.js', '100', 'Binary Search Trees Implementation', 1, 'Binary Search Trees Implementation', 'Implement BST insertion, deletion, and traversal in JS/Java.', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 100, 40, 'Written Essay', 'pdf, zip, docx', 10, 1, 'School', 'Class XI', 'Computer Science - Data Structures', 'Term I', 'Marks', 0, 1);

-- 4. Seed student homework submissions
INSERT IGNORE INTO sm_homework_students (id, homework_id, student_id, complete_status, marks, file, feedback_file, submission_link, student_notes, feedback, rubric_accuracy, rubric_completeness, rubric_presentation, active_status, school_id) VALUES
(1001, 1001, 1, 'C', '45', 'gravitation_report.pdf', 'graded_feedback.pdf', 'https://github.com/rahul/gravitation', 'My Lab report is attached. Answers are solved.', 'Excellent analysis of force equations!', 9, 9, 9, 1, '1'),
(1002, 1002, 2, 'NC', NULL, 'bst_index.js', NULL, 'https://github.com/sneha/bst', 'BST completed. Attached is index.js.', NULL, NULL, NULL, NULL, 1, '1');

-- 5. Seed quiz data
INSERT IGNORE INTO lms_quizzes (id, title, start_date, end_date, duration, status, assigned_class, assigned_section) VALUES
(1001, 'Midterm Physics Quiz', NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY), 30, 'Published', 'Class XI', 'Physics Class XI - Mechanics'),
(1002, 'Data Structures MCQ', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 45, 'Published', 'Class XI', 'Computer Science - Data Structures');

-- 6. Seed quiz questions
INSERT IGNORE INTO lms_quiz_questions (id, quiz_id, question_text, question_type, options, correct) VALUES
(1001, 1001, 'What is the value of acceleration due to gravity on Earth?', 'Single Choice MCQ', '["9.8 m/s^2", "10.5 m/s^2", "8.9 m/s^2", "7.6 m/s^2"]', '0'),
(1002, 1002, 'What is the time complexity of searching in a balanced Binary Search Tree?', 'Single Choice MCQ', '["O(N)", "O(log N)", "O(N log N)", "O(1)"]', '1');

-- 7. Seed quiz attempts
INSERT IGNORE INTO lms_quiz_attempts (id, quiz_id, student_id, score, evaluated, remarks, answers, submitted_date, allowed_reattempt) VALUES
(1001, 1001, 2, 100, 1, 'Good attempt.', '{"1001": 0}', NOW(), 0),
(1002, 1002, 3, 100, 1, 'Well done.', '{"1002": 1}', NOW(), 0);
