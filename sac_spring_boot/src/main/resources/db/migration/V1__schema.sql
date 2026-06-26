-- Core Tenant Schools Table
CREATE TABLE `sm_schools` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `school_name` varchar(200) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `domain` varchar(191) DEFAULT NULL,
  `school_code` varchar(100) DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_group_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sm_schools_domain_unique` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles Tables
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'System',
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `roles_school_id_foreign` (`school_id`),
  CONSTRAINT `roles_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `infix_roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'System',
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `is_saas` int unsigned DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `infix_roles_school_id_foreign` (`school_id`),
  CONSTRAINT `infix_roles_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `is_administrator` tinyint(1) NOT NULL DEFAULT '0',
  `active_status` tinyint NOT NULL DEFAULT '1',
  `role_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `device_token` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_school_id_foreign` (`school_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SuperAdmins Table
CREATE TABLE `super_admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `phone_number` varchar(191) DEFAULT NULL,
  `active_status` tinyint(1) NOT NULL DEFAULT '1',
  `role` varchar(191) NOT NULL DEFAULT 'super_admin',
  `school_group_id` bigint unsigned DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `super_admins_username_unique` (`username`),
  UNIQUE KEY `super_admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions Table
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `module` varchar(191) DEFAULT NULL,
  `sidebar_menu` varchar(191) DEFAULT NULL,
  `section_id` int DEFAULT '1',
  `parent_id` int DEFAULT '0',
  `name` varchar(191) DEFAULT NULL,
  `route` varchar(191) DEFAULT NULL,
  `parent_route` varchar(191) DEFAULT NULL,
  `type` int DEFAULT NULL COMMENT '1 = menu, 2 = submenu, 3 = action',
  `lang_name` varchar(191) DEFAULT NULL,
  `icon` text,
  `svg` text,
  `status` tinyint NOT NULL DEFAULT '1',
  `menu_status` tinyint NOT NULL DEFAULT '1',
  `position` int NOT NULL DEFAULT '1',
  `is_saas` tinyint NOT NULL DEFAULT '0',
  `school_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `permissions_school_id_foreign` (`school_id`),
  CONSTRAINT `permissions_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assign Permissions Table
CREATE TABLE `assign_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `permission_id` int DEFAULT NULL,
  `role_id` int unsigned DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `menu_status` tinyint(1) NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assign_permissions_school_id_foreign` (`school_id`),
  CONSTRAINT `assign_permissions_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sidebar Menus Table
CREATE TABLE `sm_menus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) DEFAULT NULL,
  `module` varchar(191) DEFAULT NULL,
  `route` varchar(191) DEFAULT NULL,
  `lang_name` varchar(191) DEFAULT NULL,
  `section_id` bigint unsigned DEFAULT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `is_saas` tinyint DEFAULT NULL,
  `role_id` bigint unsigned DEFAULT NULL,
  `menu_status` tinyint DEFAULT NULL,
  `permission_section` tinyint DEFAULT NULL,
  `position` int DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `school_id` bigint unsigned DEFAULT NULL,
  `permission_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Academic Years Table
CREATE TABLE `sm_academic_years` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `year` varchar(100) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_academic_years_school_id_foreign` (`school_id`),
  CONSTRAINT `sm_academic_years_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Core Academic Tables
CREATE TABLE `sm_classes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `class_name` varchar(15) NOT NULL,
  `pass_mark` double DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_classes_school_id_foreign` (`school_id`),
  KEY `sm_classes_academic_id_foreign` (`academic_id`),
  CONSTRAINT `sm_classes_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_classes_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sm_sections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `section_name` varchar(15) NOT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_sections_school_id_foreign` (`school_id`),
  KEY `sm_sections_academic_id_foreign` (`academic_id`),
  CONSTRAINT `sm_sections_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_sections_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sm_class_sections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_class_sections_class_id_foreign` (`class_id`),
  KEY `sm_class_sections_section_id_foreign` (`section_id`),
  CONSTRAINT `sm_class_sections_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_sections_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sm_subjects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(255) NOT NULL,
  `subject_code` varchar(255) DEFAULT NULL,
  `pass_mark` double DEFAULT NULL,
  `subject_type` enum('T','P') NOT NULL COMMENT 'T=Theory, P=Practical',
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_subjects_school_id_foreign` (`school_id`),
  KEY `sm_subjects_academic_id_foreign` (`academic_id`),
  CONSTRAINT `sm_subjects_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_subjects_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Base Setups Table (for Genders, Religions, Blood Groups)
CREATE TABLE `sm_base_setups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL, -- 'gender', 'religion', 'blood_group'
  `active_status` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HR Structures
CREATE TABLE `sm_designations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `sm_designations_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sm_human_departments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `sm_human_departments_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sm_staffs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `staff_no` int DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `basic_salary` varchar(200) DEFAULT NULL,
  `contract_type` varchar(200) DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `designation_id` int unsigned DEFAULT NULL,
  `department_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `role_id` int unsigned DEFAULT NULL,
  `gender_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_staffs_designation_id_foreign` (`designation_id`),
  KEY `sm_staffs_department_id_foreign` (`department_id`),
  KEY `sm_staffs_user_id_foreign` (`user_id`),
  KEY `sm_staffs_role_id_foreign` (`role_id`),
  KEY `sm_staffs_gender_id_foreign` (`gender_id`),
  KEY `sm_staffs_school_id_foreign` (`school_id`),
  CONSTRAINT `sm_staffs_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `sm_human_departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sm_staffs_designation_id_foreign` FOREIGN KEY (`designation_id`) REFERENCES `sm_designations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sm_staffs_gender_id_foreign` FOREIGN KEY (`gender_id`) REFERENCES `sm_base_setups` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sm_staffs_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `infix_roles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sm_staffs_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_staffs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assign Subject Table
CREATE TABLE `sm_assign_subjects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` int unsigned DEFAULT NULL,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `subject_id` int unsigned DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_assign_subjects_teacher_id_foreign` (`teacher_id`),
  KEY `sm_assign_subjects_class_id_foreign` (`class_id`),
  KEY `sm_assign_subjects_section_id_foreign` (`section_id`),
  KEY `sm_assign_subjects_subject_id_foreign` (`subject_id`),
  CONSTRAINT `sm_assign_subjects_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_assign_subjects_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_assign_subjects_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `sm_subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_assign_subjects_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `sm_staffs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Parents Table
CREATE TABLE `sm_parents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fathers_name` varchar(200) DEFAULT NULL,
  `fathers_mobile` varchar(200) DEFAULT NULL,
  `fathers_occupation` varchar(200) DEFAULT NULL,
  `fathers_photo` varchar(200) DEFAULT NULL,
  `mothers_name` varchar(200) DEFAULT NULL,
  `mothers_mobile` varchar(200) DEFAULT NULL,
  `mothers_occupation` varchar(200) DEFAULT NULL,
  `mothers_photo` varchar(200) DEFAULT NULL,
  `relation` varchar(200) DEFAULT NULL,
  `guardians_name` varchar(200) DEFAULT NULL,
  `guardians_mobile` varchar(200) DEFAULT NULL,
  `guardians_email` varchar(200) DEFAULT NULL,
  `guardians_occupation` varchar(200) DEFAULT NULL,
  `guardians_relation` varchar(30) DEFAULT NULL,
  `guardians_photo` varchar(200) DEFAULT NULL,
  `guardians_address` varchar(200) DEFAULT NULL,
  `is_guardian` int DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `user_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_parents_user_id_foreign` (`user_id`),
  KEY `sm_parents_school_id_foreign` (`school_id`),
  CONSTRAINT `sm_parents_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_parents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student Categories & Groups
CREATE TABLE `sm_student_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_student_categories_school_id_foreign` (`school_id`),
  CONSTRAINT `sm_student_categories_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sm_student_groups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(200) NOT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_student_groups_school_id_foreign` (`school_id`),
  CONSTRAINT `sm_student_groups_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student Table
CREATE TABLE `sm_students` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admission_no` int DEFAULT NULL,
  `roll_no` int DEFAULT NULL,
  `first_name` varchar(70) DEFAULT NULL,
  `last_name` varchar(70) DEFAULT NULL,
  `full_name` varchar(130) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `caste` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `student_photo` varchar(191) DEFAULT NULL,
  `age` varchar(20) DEFAULT NULL,
  `height` varchar(20) DEFAULT NULL,
  `weight` varchar(200) DEFAULT NULL,
  `current_address` text,
  `permanent_address` text,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `bloodgroup_id` int unsigned DEFAULT NULL,
  `religion_id` int unsigned DEFAULT NULL,
  `student_category_id` int unsigned DEFAULT NULL,
  `student_group_id` int unsigned DEFAULT NULL,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `parent_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `role_id` int unsigned DEFAULT NULL,
  `gender_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned NOT NULL DEFAULT '1',
  `academic_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_students_class_id_foreign` (`class_id`),
  KEY `sm_students_parent_id_foreign` (`parent_id`),
  KEY `sm_students_user_id_foreign` (`user_id`),
  KEY `sm_students_school_id_foreign` (`school_id`),
  CONSTRAINT `sm_students_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sm_students_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `sm_parents` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sm_students_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student Records Table
CREATE TABLE `student_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `roll_no` varchar(191) DEFAULT NULL,
  `is_promote` tinyint(1) DEFAULT '0',
  `is_default` tinyint DEFAULT '0',
  `session_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned NOT NULL DEFAULT '1',
  `academic_id` int unsigned DEFAULT NULL,
  `student_id` int unsigned DEFAULT NULL,
  `active_status` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_records_class_id_foreign` (`class_id`),
  KEY `student_records_section_id_foreign` (`section_id`),
  KEY `student_records_school_id_foreign` (`school_id`),
  KEY `student_records_student_id_foreign` (`student_id`),
  CONSTRAINT `student_records_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_records_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_records_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_records_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `sm_students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
