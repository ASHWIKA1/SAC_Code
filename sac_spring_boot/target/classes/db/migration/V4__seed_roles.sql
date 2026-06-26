-- Default school tenant seed
INSERT INTO `sm_schools` (`id`, `school_name`, `email`, `phone`, `address`, `domain`, `school_code`, `active_status`) VALUES 
(1, 'System Demo School', 'demo@sacgotek.com', '123456789', 'Demo Address', 'localhost', 'DEMO-101', 1);

-- Default system roles seed
INSERT INTO `roles` (`id`, `name`, `type`, `active_status`, `school_id`) VALUES 
(1, 'Admin', 'System', 1, 1),
(2, 'Teacher', 'System', 1, 1),
(3, 'Student', 'System', 1, 1),
(4, 'Parent', 'System', 1, 1),
(5, 'Staff', 'System', 1, 1);

-- Default infix_roles seed (custom roles)
INSERT INTO `infix_roles` (`id`, `name`, `type`, `active_status`, `school_id`, `is_saas`) VALUES 
(1, 'Admin', 'System', 1, 1, 0),
(2, 'Teacher', 'System', 1, 1, 0),
(3, 'Student', 'System', 1, 1, 0),
(4, 'Parent', 'System', 1, 1, 0),
(5, 'Staff', 'System', 1, 1, 0);
