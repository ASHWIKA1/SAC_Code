-- Core Menu Structure Seeds
INSERT INTO `sm_menus` (`id`, `name`, `route`, `parent_id`, `status`, `menu_status`, `position`) VALUES 
(1, 'Dashboard', 'dashboard', NULL, 1, 1, 1),
(2, 'Academics', 'academics', NULL, 1, 1, 2),
(3, 'Class', 'class', 2, 1, 1, 1),
(4, 'Section', 'section', 2, 1, 1, 2),
(5, 'Subjects', 'subject', 2, 1, 1, 3),
(6, 'Assign Subject', 'assign_subject', 2, 1, 1, 4),
(7, 'Student Info', 'student_info', NULL, 1, 1, 3),
(8, 'Student List', 'student_list', 7, 1, 1, 1),
(9, 'Add Student', 'student_admission', 7, 1, 1, 2),
(10, 'Student Promote', 'student_promote', 7, 1, 1, 3),
(11, 'Human Resource', 'human_resource', NULL, 1, 1, 4),
(12, 'Staff Directory', 'staff_directory', 11, 1, 1, 1),
(13, 'Staff Attendance', 'staff_attendance', 11, 1, 1, 2);
