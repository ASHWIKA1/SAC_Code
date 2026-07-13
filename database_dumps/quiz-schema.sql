CREATE TABLE IF NOT EXISTS `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `institute_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `type` int NOT NULL COMMENT '1: MCQ, 2: TRUE_FALSE',
  `complexity` int NOT NULL COMMENT 'EASY, MEDIUM, HARD',
  `marks` double NOT NULL,
  `question_text` text DEFAULT NULL,
  `question_options_json` JSON DEFAULT NULL COMMENT 'MCQ/True-False options',
  `correct_answer` text DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL,
  `updated_by_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci



CREATE TABLE `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `institute_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `exam_type` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'Duration of the quiz in minutes',
  `status` int(11) DEFAULT NULL COMMENT '1=Draft, 2=Scheduled, 3=Published, 4=Completed',
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_by_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


CREATE TABLE `quiz_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `institute_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `original_question_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` int(11) NOT NULL,
  `marks` double NOT NULL,
  `complexity` int NOT NULL COMMENT 'EASY, MEDIUM, HARD',
  `negative_marks` double DEFAULT 0,
  `correct_answer` text DEFAULT NULL,
  `options_json` JSON DEFAULT NULL COMMENT 'copy of question options',
  `status` int(11) DEFAULT 1,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT 0, 
  `updated_by_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`),
  KEY `original_question_id` (`original_question_id`),
  CONSTRAINT `quiz_question_question_id` FOREIGN KEY (`original_question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `quiz_question_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


CREATE TABLE IF NOT EXISTS user_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id int(11) NOT NULL,
    quiz_id INT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    start_date_time datetime DEFAULT NULL,
  	end_date_time datetime DEFAULT NULL,
  	max_marks double DEFAULT 0,
    obtain_marks double DEFAULT 0,
    obtained_negative_marks double DEFAULT 0,
	  count_of_correct_answers int DEFAULT 0,
  	count_of_incorrect_answers int DEFAULT 0,
  	count_of_unanswered int DEFAULT 0,
    score_achieved DECIMAL(5,2) DEFAULT NULL,
    faculty_remarks TEXT DEFAULT NULL,
    created_date datetime NOT NULL,
  	updated_date datetime NOT NULL,
  	is_deleted int(11) NOT NULL DEFAULT 0,
  	updated_by_user_id int(11) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE KEY idx_student_attempt (quiz_id, user_id)
);


CREATE TABLE IF NOT EXISTS `user_quiz_response` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `institute_id` int(11) NOT NULL,
  `user_quiz_id` int(11) NOT NULL,
  `quiz_question_id` int(11) NOT NULL,
  `answer_text` text DEFAULT NULL,
  `is_answer_correct` tinyint(1) DEFAULT NULL,
  `selected_option` text DEFAULT NULL,
  `user_action` text DEFAULT NULL COMMENT 'user has skipped/attempted/not-attempted/mark-for-review',
  `marks_obtained` double DEFAULT 0,
  `obtained_negative_marks` double DEFAULT 0,
  `created_date` datetime NOT NULL,
  `updated_date` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT 0,
  `updated_by_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_quiz_response_user_quiz_id_idx` (`user_quiz_id`),
  KEY `fk_user_quiz_response_quiz_question_id_idx` (`quiz_question_id`),
  CONSTRAINT `fk_user_quiz_response_quiz_question_id` FOREIGN KEY (`quiz_question_id`) REFERENCES `quiz_question` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_quiz_response_user_quiz_id` FOREIGN KEY (`user_quiz_id`) REFERENCES `user_quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


