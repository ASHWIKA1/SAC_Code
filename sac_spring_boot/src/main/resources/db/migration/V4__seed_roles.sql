-- Default school tenant seed
INSERT IGNORE INTO `sm_schools` (`id`, `school_name`, `email`, `phone`, `address`, `domain`, `school_code`, `active_status`) VALUES 
(1, 'System Demo School', 'demo@sacgotek.com', '123456789', 'Demo Address', 'localhost', 'DEMO-101', 1);

-- Default system roles seed
INSERT IGNORE INTO `roles` (`id`, `name`, `type`, `active_status`, `school_id`) VALUES 
(1, 'Admin', 'System', 1, 1),
(2, 'Teacher', 'System', 1, 1),
(3, 'Student', 'System', 1, 1),
(4, 'Parent', 'System', 1, 1),
(5, 'Staff', 'System', 1, 1);

-- Ensure infix_roles table exists
CREATE TABLE IF NOT EXISTS `infix_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'System',
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` bigint DEFAULT '1',
  `is_saas` int unsigned DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `infix_roles_school_id_foreign` (`school_id`),
  CONSTRAINT `infix_roles_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default infix_roles seed (custom roles)
INSERT IGNORE INTO `infix_roles` (`id`, `name`, `type`, `active_status`, `school_id`, `is_saas`) VALUES 
(1, 'Admin', 'System', 1, 1, 0),
(2, 'Teacher', 'System', 1, 1, 0),
(3, 'Student', 'System', 1, 1, 0),
(4, 'Parent', 'System', 1, 1, 0),
(5, 'Staff', 'System', 1, 1, 0);
