-- Flyway migration script for missing entity tables (Exam Plan, Seat Plan, WhatsApp, AI Content, Notification, Wallet, Zoom, Lesson, Transport, Finance, etc.)

-- 1. admit_card_settings
CREATE TABLE IF NOT EXISTS `admit_card_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `heading` text DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `show_photo` int DEFAULT 1,
  `show_exam_schedule` int DEFAULT 1,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. admit_cards
CREATE TABLE IF NOT EXISTS `admit_cards` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_record_id` bigint DEFAULT NULL,
  `exam_type_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `roll_no` varchar(255) DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. seat_plans
CREATE TABLE IF NOT EXISTS `seat_plans` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_record_id` bigint DEFAULT NULL,
  `exam_type_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `room_no` varchar(255) DEFAULT NULL,
  `seat_no` varchar(255) DEFAULT NULL,
  `row_no` int DEFAULT NULL,
  `col_no` int DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. seat_plan_settings
CREATE TABLE IF NOT EXISTS `seat_plan_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `rows_per_room` int DEFAULT 5,
  `cols_per_room` int DEFAULT 5,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. agents
CREATE TABLE IF NOT EXISTS `agents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `always_available` tinyint(1) DEFAULT 0,
  `active_status` int DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. agent_times
CREATE TABLE IF NOT EXISTS `agent_times` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `agent_id` bigint DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `start` varchar(255) DEFAULT NULL,
  `end` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sender` varchar(255) DEFAULT NULL,
  `receiver` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `agent_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `agent_type` varchar(255) DEFAULT 'single',
  `availability` varchar(255) DEFAULT 'both',
  `disable_for_admin_panel` tinyint(1) DEFAULT 0,
  `phone` varchar(255) DEFAULT NULL,
  `greeting_message` text DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. ai_content_settings
CREATE TABLE IF NOT EXISTS `ai_content_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ai_default_model` varchar(255) DEFAULT 'gpt-3.5-turbo-instruct',
  `ai_default_language` varchar(255) DEFAULT 'en',
  `ai_default_tone` varchar(255) DEFAULT 'professional',
  `ai_max_result_length` int DEFAULT 500,
  `ai_default_creativity` varchar(255) DEFAULT '0.5',
  `open_ai_secret_key` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `role_id` bigint DEFAULT NULL,
  `school_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `link` varchar(500) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. wallet_settings
CREATE TABLE IF NOT EXISTS `wallet_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `school_id` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `min_amount` decimal(10,2) DEFAULT NULL,
  `max_amount` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `payment_gateway` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. wallet_transactions
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `school_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `bank_id` bigint DEFAULT NULL,
  `expense` decimal(10,2) DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `transaction_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reference_no` varchar(100) DEFAULT NULL,
  `payment_gateway` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. zoom_meetings
CREATE TABLE IF NOT EXISTS `zoom_meetings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `meeting_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date_of_meeting` varchar(255) DEFAULT NULL,
  `time_of_meeting` varchar(255) DEFAULT NULL,
  `meeting_duration` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `time_before_start` int DEFAULT NULL,
  `join_before_host` tinyint(1) DEFAULT 0,
  `host_video` tinyint(1) DEFAULT 0,
  `participant_video` tinyint(1) DEFAULT 0,
  `mute_upon_entry` tinyint(1) DEFAULT 0,
  `waiting_room` tinyint(1) DEFAULT 0,
  `audio` varchar(20) DEFAULT 'both',
  `auto_recording` varchar(20) DEFAULT 'none',
  `approval_type` int DEFAULT 0,
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurring_type` int DEFAULT NULL,
  `recurring_repect_day` int DEFAULT NULL,
  `weekly_days` varchar(255) DEFAULT NULL,
  `recurring_end_date` varchar(255) DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `status` int DEFAULT 1,
  `local_video` text DEFAULT NULL,
  `video_link` text DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. zoom_settings
CREATE TABLE IF NOT EXISTS `zoom_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `package_id` int DEFAULT 1,
  `host_video` tinyint(1) DEFAULT 0,
  `participant_video` tinyint(1) DEFAULT 0,
  `join_before_host` tinyint(1) DEFAULT 0,
  `audio` varchar(20) DEFAULT 'both',
  `auto_recording` varchar(20) DEFAULT 'none',
  `approval_type` int DEFAULT 0,
  `mute_upon_entry` tinyint(1) DEFAULT 0,
  `waiting_room` tinyint(1) DEFAULT 0,
  `api_use_for` int DEFAULT 0,
  `api_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. zoom_virtual_class
CREATE TABLE IF NOT EXISTS `zoom_virtual_class` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `meeting_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `attached_file` text DEFAULT NULL,
  `date_of_meeting` varchar(255) DEFAULT NULL,
  `time_of_meeting` varchar(255) DEFAULT NULL,
  `meeting_duration` varchar(255) DEFAULT NULL,
  `time_before_start` int DEFAULT NULL,
  `join_before_host` tinyint(1) DEFAULT NULL,
  `host_video` tinyint(1) DEFAULT NULL,
  `participant_video` tinyint(1) DEFAULT NULL,
  `mute_upon_entry` tinyint(1) DEFAULT NULL,
  `waiting_room` tinyint(1) DEFAULT NULL,
  `audio` varchar(20) DEFAULT 'both',
  `auto_recording` varchar(20) DEFAULT 'none',
  `approval_type` varchar(10) DEFAULT '0',
  `is_recurring` tinyint(1) DEFAULT NULL,
  `recurring_type` int DEFAULT NULL,
  `recurring_repect_day` int DEFAULT NULL,
  `weekly_days` varchar(255) DEFAULT NULL,
  `recurring_end_date` varchar(255) DEFAULT NULL,
  `status` int DEFAULT 1,
  `local_video` text DEFAULT NULL,
  `vedio_link` text DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. zoom_virtual_class_teachers
CREATE TABLE IF NOT EXISTS `zoom_virtual_class_teachers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `meeting_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. ai_generated_contents
CREATE TABLE IF NOT EXISTS `ai_generated_contents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `tone` varchar(255) DEFAULT NULL,
  `creativity` varchar(255) DEFAULT NULL,
  `word_count` int DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. ai_template_contents
CREATE TABLE IF NOT EXISTS `ai_template_contents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. ai_templates
CREATE TABLE IF NOT EXISTS `ai_templates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` int DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. download_content_types
CREATE TABLE IF NOT EXISTS `download_content_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `school_id` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. download_contents
CREATE TABLE IF NOT EXISTS `download_contents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `school_id` varchar(255) NOT NULL,
  `content_type_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `uploaded_by` bigint DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `download_count` bigint DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. lesson_planners
CREATE TABLE IF NOT EXISTS `lesson_planners` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `day` int DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `lesson_id` bigint DEFAULT NULL,
  `topic_id` bigint DEFAULT NULL,
  `lesson_detail_id` bigint DEFAULT NULL,
  `topic_detail_id` bigint DEFAULT NULL,
  `sub_topic` varchar(255) DEFAULT NULL,
  `lecture_youube_link` text DEFAULT NULL,
  `lecture_vedio` text DEFAULT NULL,
  `attachment` text DEFAULT NULL,
  `teaching_method` text DEFAULT NULL,
  `general_objectives` text DEFAULT NULL,
  `previous_knowlege` text DEFAULT NULL,
  `comp_question` text DEFAULT NULL,
  `zoom_setup` text DEFAULT NULL,
  `presentation` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `lesson_date` date DEFAULT NULL,
  `competed_date` date DEFAULT NULL,
  `completed_status` varchar(255) DEFAULT NULL,
  `room_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  `class_period_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `routine_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. sm_bank_accounts
CREATE TABLE IF NOT EXISTS `sm_bank_accounts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_no` varchar(255) DEFAULT NULL,
  `opening_balance` double DEFAULT 0.0,
  `current_balance` double DEFAULT 0.0,
  `active_status` int DEFAULT 1,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. sm_exam_setups
CREATE TABLE IF NOT EXISTS `sm_exam_setups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `exam_title` varchar(255) DEFAULT NULL,
  `exam_mark` double DEFAULT NULL,
  `active_status` int NOT NULL DEFAULT 1,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `exam_term_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. sm_exam_types
CREATE TABLE IF NOT EXISTS `sm_exam_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `active_status` int NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `is_average` int NOT NULL DEFAULT 0,
  `percentage` double DEFAULT NULL,
  `average_mark` double NOT NULL DEFAULT 0.0,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. sm_item_categories
CREATE TABLE IF NOT EXISTS `sm_item_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 27. sm_lesson_details
CREATE TABLE IF NOT EXISTS `sm_lesson_details` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint DEFAULT NULL,
  `lesson_title` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 28. sm_lesson_topic_details
CREATE TABLE IF NOT EXISTS `sm_lesson_topic_details` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint DEFAULT NULL,
  `topic_title` varchar(255) NOT NULL,
  `completed_status` varchar(255) DEFAULT NULL,
  `competed_date` date DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `topic_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 29. sm_lesson_topics
CREATE TABLE IF NOT EXISTS `sm_lesson_topics` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 30. sm_lessons
CREATE TABLE IF NOT EXISTS `sm_lessons` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `lesson_title` varchar(255) DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 31. sm_marks_grades
CREATE TABLE IF NOT EXISTS `sm_marks_grades` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `grade_name` varchar(255) DEFAULT NULL,
  `gpa` double DEFAULT NULL,
  `from` double DEFAULT NULL,
  `up` double DEFAULT NULL,
  `percent_from` double DEFAULT NULL,
  `percent_upto` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `active_status` int NOT NULL DEFAULT 1,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 32. sm_staff_attendences
CREATE TABLE IF NOT EXISTS `sm_staff_attendences` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `attendence_type` varchar(10) DEFAULT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `attendence_date` date DEFAULT NULL,
  `staff_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 33. sm_student_attendances
CREATE TABLE IF NOT EXISTS `sm_student_attendances` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `attendance_type` varchar(10) DEFAULT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `attendance_date` date DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `student_record_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `section_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 34. sm_vehicles
CREATE TABLE IF NOT EXISTS `sm_vehicles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_no` varchar(255) DEFAULT NULL,
  `vehicle_model` varchar(255) DEFAULT NULL,
  `made_year` varchar(255) DEFAULT NULL,
  `driver_name` varchar(255) DEFAULT NULL,
  `driver_license` varchar(255) DEFAULT NULL,
  `driver_contact` varchar(255) DEFAULT NULL,
  `active_status` int DEFAULT 1,
  `school_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 35. video_watches
CREATE TABLE IF NOT EXISTS `video_watches` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `school_id` varchar(255) NOT NULL,
  `uploaded_by` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `video_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration_seconds` int DEFAULT NULL,
  `watch_count` bigint DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `class_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
