-- Flyway migration script for advanced custom modules

SET FOREIGN_KEY_CHECKS=0;
SET @saved_cs_client = @@character_set_client;

-- Schema for behaviour_record_settings ---
CREATE TABLE `behaviour_record_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_comment` int DEFAULT NULL,
  `parent_comment` int DEFAULT NULL,
  `student_view` int DEFAULT NULL,
  `parent_view` int DEFAULT NULL,
  `school_id` int unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `behaviour_record_settings`
--

-- Removed lock/unlock statement: LOCK TABLES `behaviour_record_settings` WRITE;
/*!40000 ALTER TABLE `behaviour_record_settings` DISABLE KEYS */;
INSERT INTO `behaviour_record_settings` VALUES (1,0,0,0,0,1,NULL,NULL);

-- Schema for chat_block_users ---
CREATE TABLE `chat_block_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `block_by` bigint unsigned NOT NULL,
  `block_to` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_block_users`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_block_users` WRITE;
/*!40000 ALTER TABLE `chat_block_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_block_users` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_conversations`
--

DROP TABLE IF EXISTS `chat_conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_conversations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `from_id` bigint unsigned DEFAULT NULL,
  `to_id` bigint unsigned DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0 for unread,1 for seen',
  `message_type` tinyint NOT NULL DEFAULT '0' COMMENT '0- text message, 1- image, 2- pdf, 3- doc, 4- voice',
  `file_name` text COLLATE utf8mb4_unicode_ci,
  `original_file_name` text COLLATE utf8mb4_unicode_ci,
  `initial` tinyint(1) NOT NULL DEFAULT '0',
  `reply` bigint unsigned DEFAULT NULL,
  `forward` bigint unsigned DEFAULT NULL,
  `deleted_by_to` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_conversations`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_conversations` WRITE;
/*!40000 ALTER TABLE `chat_conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_conversations` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_group_message_recipients`
--

DROP TABLE IF EXISTS `chat_group_message_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group_message_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `conversation_id` bigint unsigned NOT NULL,
  `group_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` datetime DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_message_recipients`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_group_message_recipients` WRITE;
/*!40000 ALTER TABLE `chat_group_message_recipients` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_group_message_recipients` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_group_message_removes`
--

DROP TABLE IF EXISTS `chat_group_message_removes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group_message_removes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_message_recipient_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_message_removes`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_group_message_removes` WRITE;
/*!40000 ALTER TABLE `chat_group_message_removes` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_group_message_removes` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_group_users`
--

DROP TABLE IF EXISTS `chat_group_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_group_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `role` int NOT NULL DEFAULT '1',
  `added_by` bigint unsigned NOT NULL,
  `removed_by` bigint unsigned DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_group_users`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_group_users` WRITE;
/*!40000 ALTER TABLE `chat_group_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_group_users` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_groups`
--

DROP TABLE IF EXISTS `chat_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_groups` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `privacy` int DEFAULT NULL,
  `read_only` tinyint(1) NOT NULL DEFAULT '0',
  `group_type` int NOT NULL DEFAULT '1' COMMENT '1 => Open (Anyone can send message), 2 => Close (Only Admin can send message) ',
  `created_by` bigint unsigned NOT NULL,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `subject_id` int unsigned DEFAULT NULL,
  `teacher_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned DEFAULT NULL,
  `academic_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_groups_class_id_foreign` (`class_id`),
  KEY `chat_groups_section_id_foreign` (`section_id`),
  KEY `chat_groups_subject_id_foreign` (`subject_id`),
  KEY `chat_groups_teacher_id_foreign` (`teacher_id`),
  KEY `chat_groups_school_id_foreign` (`school_id`),
  KEY `chat_groups_academic_id_foreign` (`academic_id`),
  CONSTRAINT `chat_groups_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_groups_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_groups_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_groups_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_groups_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `sm_subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_groups_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `sm_staffs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_groups`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_groups` WRITE;
/*!40000 ALTER TABLE `chat_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_groups` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_invitation_types`
--

DROP TABLE IF EXISTS `chat_invitation_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_invitation_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invitation_id` bigint unsigned NOT NULL,
  `type` enum('one-to-one','group','class-teacher') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'one-to-one',
  `section_id` bigint unsigned DEFAULT NULL,
  `class_teacher_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_invitation_types`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_invitation_types` WRITE;
/*!40000 ALTER TABLE `chat_invitation_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_invitation_types` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_invitations`
--

DROP TABLE IF EXISTS `chat_invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_invitations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `from` int unsigned NOT NULL,
  `to` int unsigned NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0- pending, 1- connected, 2- blocked',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_invitations`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_invitations` WRITE;
/*!40000 ALTER TABLE `chat_invitations` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_invitations` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `chat_statuses`
--

DROP TABLE IF EXISTS `chat_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_statuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0- inactive, 1- active, 2- away, 3- busy',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_statuses`
--

-- Removed lock/unlock statement: LOCK TABLES `chat_statuses` WRITE;
/*!40000 ALTER TABLE `chat_statuses` DISABLE KEYS */;
INSERT INTO `chat_statuses` VALUES (1,1,0,'2026-05-15 06:52:42','2026-06-16 21:20:46'),(2,2,0,'2026-05-15 06:52:57','2026-05-15 06:52:57'),(3,3,0,'2026-05-15 06:52:57','2026-05-15 06:52:57'),(4,4,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(5,5,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(6,6,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(7,7,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(8,8,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(9,9,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(10,10,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(11,11,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(12,12,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(13,13,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(14,14,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(15,15,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(16,16,0,'2026-05-15 06:52:58','2026-05-15 06:52:58'),(17,17,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(18,18,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(19,19,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(20,20,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(21,21,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(22,22,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(23,23,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(24,24,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(25,25,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(26,26,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(27,27,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(28,28,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(29,29,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(30,30,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(31,31,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(32,32,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(33,33,0,'2026-05-15 06:52:59','2026-05-15 06:52:59'),(34,34,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(35,35,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(36,36,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(37,37,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(38,38,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(39,39,0,'2026-05-15 06:53:00','2026-06-16 21:20:19'),(40,40,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(41,41,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(42,42,0,'2026-05-15 06:53:00','2026-06-16 21:21:03'),(43,43,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(44,44,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(45,45,0,'2026-05-15 06:53:00','2026-05-15 06:53:00'),(46,46,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(47,47,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(48,48,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(49,49,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(50,50,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(51,51,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(52,52,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(53,53,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(54,54,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(55,55,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(56,56,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(57,57,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(58,58,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(59,59,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(60,60,0,'2026-05-15 06:53:01','2026-05-15 06:53:01'),(61,61,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(62,62,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(63,63,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(64,64,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(65,65,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(66,66,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(67,67,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(68,68,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(69,69,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(70,70,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(71,71,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(72,72,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(73,73,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(74,74,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(75,75,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(76,76,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(77,77,0,'2026-05-15 06:53:02','2026-05-15 06:53:02'),(78,78,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(79,79,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(80,80,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(81,81,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(82,82,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(83,83,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(84,84,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(85,85,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(86,86,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(87,87,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(88,88,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(89,89,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(90,90,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(91,91,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(92,92,0,'2026-05-15 06:53:03','2026-05-15 06:53:03'),(93,93,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(94,94,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(95,95,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(96,96,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(97,97,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(98,98,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(99,99,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(100,100,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(101,101,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(102,102,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(103,103,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(104,104,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(105,105,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(106,106,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(107,107,0,'2026-05-15 06:53:07','2026-05-15 06:53:07'),(108,108,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(109,109,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(110,110,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(111,111,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(112,112,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(113,113,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(114,114,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(115,115,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(116,116,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(117,117,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(118,118,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(119,119,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(120,120,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(121,121,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(122,122,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(123,123,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(124,124,0,'2026-05-15 06:53:08','2026-05-15 06:53:08'),(125,125,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(126,126,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(127,127,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(128,128,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(129,129,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(130,130,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(131,131,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(132,132,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(133,133,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(134,134,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(135,135,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(136,136,0,'2026-05-15 06:53:09','2026-05-15 06:53:09'),(137,137,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(138,138,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(139,139,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(140,140,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(141,141,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(142,142,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(143,143,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(144,144,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(145,145,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(146,146,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(147,147,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(148,148,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(149,149,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(150,150,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(151,151,0,'2026-05-15 06:53:10','2026-05-15 06:53:10'),(152,152,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(153,153,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(154,154,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(155,155,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(156,156,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(157,157,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(158,158,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(159,159,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(160,160,0,'2026-05-15 06:53:11','2026-05-15 06:53:11'),(161,161,1,'2026-05-19 23:20:30','2026-06-16 21:51:15');

-- Schema for front_class_routines ---
CREATE TABLE `front_class_routines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publish_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result_file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `front_class_routines_school_id_foreign` (`school_id`),
  CONSTRAINT `front_class_routines_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `front_class_routines`
--

-- Removed lock/unlock statement: LOCK TABLES `front_class_routines` WRITE;
/*!40000 ALTER TABLE `front_class_routines` DISABLE KEYS */;
INSERT INTO `front_class_routines` VALUES (1,'Class Routine - Class 1 - (A)','2026-05-15','public/uploads/front_class_routine/class_routine_1_1.pdf',1,'2026-05-15 06:53:04','2026-05-15 06:53:04'),(2,'Class Routine - Class 1 - (B)','2026-05-15','public/uploads/front_class_routine/class_routine_1_2.pdf',1,'2026-05-15 06:53:04','2026-05-15 06:53:04'),(3,'Class Routine - Class 1 - (C)','2026-05-15','public/uploads/front_class_routine/class_routine_1_3.pdf',1,'2026-05-15 06:53:04','2026-05-15 06:53:04'),(4,'Class Routine - Class 1 - (D)','2026-05-15','public/uploads/front_class_routine/class_routine_1_4.pdf',1,'2026-05-15 06:53:04','2026-05-15 06:53:04'),(5,'Class Routine - Class 1 - (E)','2026-05-15','public/uploads/front_class_routine/class_routine_1_5.pdf',1,'2026-05-15 06:53:04','2026-05-15 06:53:04');

-- Schema for front_exam_routines ---
CREATE TABLE `front_exam_routines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publish_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result_file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `front_exam_routines_school_id_foreign` (`school_id`),
  CONSTRAINT `front_exam_routines_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `front_exam_routines`
--

-- Removed lock/unlock statement: LOCK TABLES `front_exam_routines` WRITE;
/*!40000 ALTER TABLE `front_exam_routines` DISABLE KEYS */;
INSERT INTO `front_exam_routines` VALUES (1,'First TermClass 1 - (A)','2026-05-15','public/uploads/front_exam_routine/exam_routine_1_1.pdf',1,'2026-05-15 06:53:06','2026-05-15 06:53:06'),(2,'First TermClass 1 - (B)','2026-05-15','public/uploads/front_exam_routine/exam_routine_1_2.pdf',1,'2026-05-15 06:53:06','2026-05-15 06:53:06'),(3,'First TermClass 1 - (C)','2026-05-15','public/uploads/front_exam_routine/exam_routine_1_3.pdf',1,'2026-05-15 06:53:06','2026-05-15 06:53:06'),(4,'First TermClass 1 - (D)','2026-05-15','public/uploads/front_exam_routine/exam_routine_1_4.pdf',1,'2026-05-15 06:53:06','2026-05-15 06:53:06'),(5,'First TermClass 1 - (E)','2026-05-15','public/uploads/front_exam_routine/exam_routine_1_5.pdf',1,'2026-05-15 06:53:06','2026-05-15 06:53:06');

-- Schema for jitsi_meeting_users ---
CREATE TABLE `jitsi_meeting_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL DEFAULT '1',
  `user_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jitsi_meeting_users`
--

-- Removed lock/unlock statement: LOCK TABLES `jitsi_meeting_users` WRITE;
/*!40000 ALTER TABLE `jitsi_meeting_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `jitsi_meeting_users` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `jitsi_meetings`
--

DROP TABLE IF EXISTS `jitsi_meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jitsi_meetings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_by` int DEFAULT '1',
  `instructor_id` int DEFAULT '1',
  `member_type` int DEFAULT NULL,
  `meeting_id` text COLLATE utf8mb4_unicode_ci,
  `topic` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `file` text COLLATE utf8mb4_unicode_ci,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `time_start_before` text COLLATE utf8mb4_unicode_ci,
  `date` text COLLATE utf8mb4_unicode_ci,
  `time` text COLLATE utf8mb4_unicode_ci,
  `datetime` text COLLATE utf8mb4_unicode_ci,
  `duration` int DEFAULT '0' COMMENT '0 means unlimited',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jitsi_meetings`
--

-- Removed lock/unlock statement: LOCK TABLES `jitsi_meetings` WRITE;
/*!40000 ALTER TABLE `jitsi_meetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `jitsi_meetings` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `jitsi_settings`
--

DROP TABLE IF EXISTS `jitsi_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jitsi_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jitsi_server` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://meet.jit.si/',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jitsi_settings`
--

-- Removed lock/unlock statement: LOCK TABLES `jitsi_settings` WRITE;
/*!40000 ALTER TABLE `jitsi_settings` DISABLE KEYS */;
INSERT INTO `jitsi_settings` VALUES (1,'https://meet.jit.si/','2026-05-15 06:52:48','2026-05-15 06:52:48');

-- Schema for jitsi_virtual_class_teachers ---
CREATE TABLE `jitsi_virtual_class_teachers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `meeting_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL COMMENT 'user_id',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jitsi_virtual_class_teachers`
--

-- Removed lock/unlock statement: LOCK TABLES `jitsi_virtual_class_teachers` WRITE;
/*!40000 ALTER TABLE `jitsi_virtual_class_teachers` DISABLE KEYS */;
/*!40000 ALTER TABLE `jitsi_virtual_class_teachers` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `jitsi_virtual_classes`
--

DROP TABLE IF EXISTS `jitsi_virtual_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jitsi_virtual_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_by` int DEFAULT '1',
  `meeting_id` text COLLATE utf8mb4_unicode_ci,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `section_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `topic` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `time_start_before` text COLLATE utf8mb4_unicode_ci,
  `duration` int DEFAULT '0' COMMENT '0 means unlimited',
  `date` text COLLATE utf8mb4_unicode_ci,
  `time` text COLLATE utf8mb4_unicode_ci,
  `datetime` text COLLATE utf8mb4_unicode_ci,
  `attached_file` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jitsi_virtual_classes`
--

-- Removed lock/unlock statement: LOCK TABLES `jitsi_virtual_classes` WRITE;
/*!40000 ALTER TABLE `jitsi_virtual_classes` DISABLE KEYS */;
/*!40000 ALTER TABLE `jitsi_virtual_classes` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

-- Removed lock/unlock statement: LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `native` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rtl` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '0',
  `school_id` int unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `languages_school_id_foreign` (`school_id`),
  CONSTRAINT `languages_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

-- Removed lock/unlock statement: LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'af','Afrikaans','Afrikaans',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(2,'am','Amharic','አማርኛ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(3,'ar','Arabic','العربية',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(4,'ay','Aymara','Aymar',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(5,'az','Azerbaijani','Azərbaycanca / آذربايجان',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(6,'be','Belarusian','Беларуская',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(7,'bg','Bulgarian','Български',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(8,'bi','Bislama','Bislama',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(9,'bn','Bengali','বাংলা',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(10,'bs','Bosnian','Bosanski',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(11,'ca','Catalan','Català',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(12,'ch','Chamorro','Chamoru',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(13,'cs','Czech','Česky',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(14,'da','Danish','Dansk',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(15,'de','German','Deutsch',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(16,'dv','Divehi','ދިވެހިބަސް',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(17,'dz','Dzongkha','ཇོང་ཁ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(18,'el','Greek','Ελληνικά',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(19,'en','English','English',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(20,'es','Spanish','Español',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(21,'et','Estonian','Eesti',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(22,'eu','Basque','Euskara',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(23,'fa','Persian','فارسی',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(24,'ff','Peul','Fulfulde',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(25,'fi','Finnish','Suomi',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(26,'fj','Fijian','Na Vosa Vakaviti',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(27,'fo','Faroese','Føroyskt',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(28,'fr','French','Français',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(29,'ga','Irish','Gaeilge',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(30,'gl','Galician','Galego',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(31,'gn','Guarani','Avañe\'ẽ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(32,'gv','Manx','Gaelg',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(33,'he','Hebrew','עברית',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(34,'hi','Hindi','हिन्दी',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(35,'hr','Croatian','Hrvatski',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(36,'ht','Haitian','Krèyol ayisyen',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(37,'hu','Hungarian','Magyar',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(38,'hy','Armenian','Հայերեն',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(39,'indo','Indonesian','Bahasa Indonesia',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(40,'is','Icelandic','Íslenska',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(41,'it','Italian','Italiano',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(42,'ja','Japanese','日本語',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(43,'ka','Georgian','ქართული',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(44,'kg','Kongo','KiKongo',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(45,'kk','Kazakh','Қазақша',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(46,'kl','Greenlandic','Kalaallisut',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(47,'km','Cambodian','ភាសាខ្មែរ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(48,'ko','Korean','한국어',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(49,'ku','Kurdish','Kurdî / كوردی',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(50,'ky','Kirghiz','Kırgızca / Кыргызча',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(51,'la','Latin','Latina',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(52,'lb','Luxembourgish','Lëtzebuergesch',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(53,'ln','Lingala','Lingála',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(54,'lo','Laotian','ລາວ / Pha xa lao',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(55,'lt','Lithuanian','Lietuvių',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(56,'lu','','',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(57,'lv','Latvian','Latviešu',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(58,'mg','Malagasy','Malagasy',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(59,'mh','Marshallese','Kajin Majel / Ebon',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(60,'mi','Maori','Māori',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(61,'mk','Macedonian','Македонски',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(62,'mn','Mongolian','Монгол',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(63,'ms','Malay','Bahasa Melayu',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(64,'mt','Maltese','bil-Malti',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(65,'my','Burmese','မြန်မာစာ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(66,'na','Nauruan','Dorerin Naoero',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(67,'nb','','',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(68,'nd','North Ndebele','Sindebele',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(69,'ne','Nepali','नेपाली',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(70,'nl','Dutch','Nederlands',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(71,'nn','Norwegian Nynorsk','Norsk (nynorsk)',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(72,'no','Norwegian','Norsk (bokmål / riksmål)',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(73,'nr','South Ndebele','isiNdebele',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(74,'ny','Chichewa','Chi-Chewa',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(75,'oc','Occitan','Occitan',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(76,'pa','Panjabi / Punjabi','ਪੰਜਾਬੀ / पंजाबी / پنجابي',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(77,'pl','Polish','Polski',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(78,'ps','Pashto','پښتو',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(79,'pt','Portuguese','Português',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(80,'qu','Quechua','Runa Simi',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(81,'rn','Kirundi','Kirundi',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(82,'ro','Romanian','Română',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(83,'ru','Russian','Русский',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(84,'rw','Rwandi','Kinyarwandi',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(85,'sg','Sango','Sängö',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(86,'si','Sinhalese','සිංහල',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(87,'sk','Slovak','Slovenčina',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(88,'sl','Slovenian','Slovenščina',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(89,'sm','Samoan','Gagana Samoa',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(90,'sn','Shona','chiShona',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(91,'so','Somalia','Soomaaliga',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(92,'sq','Albanian','Shqip',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(93,'sr','Serbian','Српски',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(94,'ss','Swati','SiSwati',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(95,'st','Southern Sotho','Sesotho',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(96,'sv','Swedish','Svenska',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(97,'sw','Swahili','Kiswahili',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(98,'ta','Tamil','தமிழ்',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(99,'tg','Tajik','Тоҷикӣ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(100,'th','Thai','ไทย / Phasa Thai',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(101,'ti','Tigrinya','ትግርኛ',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(102,'tk','Turkmen','Туркмен / تركمن',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(103,'tn','Tswana','Setswana',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(104,'to','Tonga','Lea Faka-Tonga',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(105,'tr','Turkish','Türkçe',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(106,'ts','Tsonga','Xitsonga',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(107,'uk','Ukrainian','Українська',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(108,'ur','Urdu','اردو',1,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(109,'uz','Uzbek','Ўзбек',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(110,'ve','Venda','Tshivenḓa',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(111,'vi','Vietnamese','Tiếng Việt',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(112,'xh','Xhosa','isiXhosa',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(113,'zh','Chinese','中文',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1),(114,'zu','Zulu','isiZulu',0,'2026-05-15 06:52:44','2026-05-15 06:52:44',0,1);

-- Schema for sm_canteen_categories ---
CREATE TABLE `sm_canteen_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `health_tag` enum('healthy','moderate','junk') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'moderate',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_categories`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_categories` WRITE;
/*!40000 ALTER TABLE `sm_canteen_categories` DISABLE KEYS */;
INSERT INTO `sm_canteen_categories` VALUES (1,'Meals',NULL,NULL,'healthy',1,0,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(2,'Beverages',NULL,NULL,'moderate',1,0,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(3,'Snacks',NULL,NULL,'junk',1,0,1,'2026-06-16 13:47:28','2026-06-16 13:47:28');

-- Schema for sm_canteen_daily_sales ---
CREATE TABLE `sm_canteen_daily_sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sale_date` date NOT NULL,
  `total_transactions` int NOT NULL DEFAULT '0',
  `total_revenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_cost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_profit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `top_items_json` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON of top selling items',
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_daily_sales`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_daily_sales` WRITE;
/*!40000 ALTER TABLE `sm_canteen_daily_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sm_canteen_daily_sales` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `sm_canteen_inventory`
--

DROP TABLE IF EXISTS `sm_canteen_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sm_canteen_inventory` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_id` bigint unsigned NOT NULL,
  `stock_quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `min_stock_level` decimal(10,2) NOT NULL DEFAULT '10.00',
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'units',
  `last_restocked` date DEFAULT NULL,
  `last_restock_qty` decimal(10,2) NOT NULL DEFAULT '0.00',
  `last_restock_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_canteen_inventory_item_id_foreign` (`item_id`),
  CONSTRAINT `sm_canteen_inventory_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `sm_canteen_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_inventory`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_inventory` WRITE;
/*!40000 ALTER TABLE `sm_canteen_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `sm_canteen_inventory` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `sm_canteen_items`
--

DROP TABLE IF EXISTS `sm_canteen_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sm_canteen_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(8,2) NOT NULL,
  `cost_price` decimal(8,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'piece' COMMENT 'piece, plate, glass, bowl',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `is_vegetarian` tinyint(1) NOT NULL DEFAULT '1',
  `calories` int DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_canteen_items_category_id_foreign` (`category_id`),
  CONSTRAINT `sm_canteen_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `sm_canteen_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_items`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_items` WRITE;
/*!40000 ALTER TABLE `sm_canteen_items` DISABLE KEYS */;
INSERT INTO `sm_canteen_items` VALUES (1,'Veg Thali',NULL,1,NULL,5.00,0.00,'piece',1,1,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(2,'Chicken Wrap',NULL,1,NULL,6.50,0.00,'piece',1,1,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(3,'Fresh Juice',NULL,2,NULL,2.50,0.00,'piece',1,1,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(4,'Coffee',NULL,2,NULL,1.50,0.00,'piece',1,1,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(5,'French Fries',NULL,3,NULL,3.00,0.00,'piece',1,1,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28');

-- Schema for sm_canteen_restrictions ---
CREATE TABLE `sm_canteen_restrictions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `item_id` bigint unsigned DEFAULT NULL,
  `restriction_type` enum('category_block','item_block','daily_limit','time_restriction') COLLATE utf8mb4_unicode_ci NOT NULL,
  `restriction_value` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g. max amount, time range',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `set_by` bigint unsigned DEFAULT NULL COMMENT 'parent or admin user id',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_restrictions`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_restrictions` WRITE;
/*!40000 ALTER TABLE `sm_canteen_restrictions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sm_canteen_restrictions` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `sm_canteen_suppliers`
--

DROP TABLE IF EXISTS `sm_canteen_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sm_canteen_suppliers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vendor_id` bigint unsigned DEFAULT NULL COMMENT 'Link to vendor module',
  `supplier_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `supply_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'fruits, vegetables, dairy, grains, beverages',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `total_supplied` decimal(12,2) NOT NULL DEFAULT '0.00',
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_suppliers`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_suppliers` WRITE;
/*!40000 ALTER TABLE `sm_canteen_suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `sm_canteen_suppliers` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `sm_canteen_transactions`
--

DROP TABLE IF EXISTS `sm_canteen_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sm_canteen_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wallet_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `type` enum('purchase','recharge','refund','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `balance_after` decimal(10,2) NOT NULL,
  `item_id` bigint unsigned DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `payment_method` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'wallet, cash, upi, rfid',
  `reference_no` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recharged_by` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'parent, admin, self',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_canteen_transactions_wallet_id_foreign` (`wallet_id`),
  CONSTRAINT `sm_canteen_transactions_wallet_id_foreign` FOREIGN KEY (`wallet_id`) REFERENCES `sm_canteen_wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_transactions`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_transactions` WRITE;
/*!40000 ALTER TABLE `sm_canteen_transactions` DISABLE KEYS */;
INSERT INTO `sm_canteen_transactions` VALUES (1,1,1,'recharge',100.00,181.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(2,2,2,'recharge',100.00,120.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(3,3,3,'recharge',100.00,154.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(4,4,4,'recharge',100.00,141.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(5,5,5,'recharge',100.00,141.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(6,6,6,'recharge',100.00,193.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(7,7,7,'recharge',100.00,127.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(8,8,8,'recharge',100.00,157.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(9,9,9,'recharge',100.00,182.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(10,10,10,'recharge',100.00,171.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(11,11,11,'recharge',100.00,198.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(12,12,12,'recharge',100.00,195.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(13,13,13,'recharge',100.00,172.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(14,14,14,'recharge',100.00,180.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(15,15,15,'recharge',100.00,142.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(16,16,16,'recharge',100.00,177.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(17,17,17,'recharge',100.00,160.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(18,18,18,'recharge',100.00,200.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(19,19,19,'recharge',100.00,170.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(20,20,20,'recharge',100.00,123.00,NULL,1,'cash',NULL,NULL,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28');

-- Schema for sm_canteen_wallets ---
CREATE TABLE `sm_canteen_wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `rfid_card_uid` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'For future RFID tap-to-pay',
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `daily_limit` decimal(8,2) NOT NULL DEFAULT '200.00' COMMENT 'Max daily spend',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `parent_id` bigint unsigned DEFAULT NULL COMMENT 'Parent who funds wallet',
  `school_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sm_canteen_wallets_student_id_school_id_unique` (`student_id`,`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_canteen_wallets`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_canteen_wallets` WRITE;
/*!40000 ALTER TABLE `sm_canteen_wallets` DISABLE KEYS */;
INSERT INTO `sm_canteen_wallets` VALUES (1,1,'LF3UZF3R',81.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(2,2,'2QP9ZAZE',20.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(3,3,'9KVFI2QG',54.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(4,4,'YUJN6IWG',41.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(5,5,'NLGMC3EY',41.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(6,6,'VM3UVD7V',93.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(7,7,'ASDGFLF2',27.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(8,8,'HWPXBRYS',57.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(9,9,'T4MGDZYL',82.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(10,10,'FXTQDOBT',71.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(11,11,'LEPDW5JF',98.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(12,12,'MKJGEC7B',95.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(13,13,'9MMGRFLK',72.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(14,14,'QI7MQZNH',80.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(15,15,'RWGYSKVR',42.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(16,16,'LHWOUTRE',77.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(17,17,'PDH2U9FW',60.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(18,18,'KFZJ9XNQ',100.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(19,19,'4PMD7YD4',70.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28'),(20,20,'79OBMD0R',23.00,50.00,1,NULL,1,'2026-06-16 13:47:28','2026-06-16 13:47:28');

-- Schema for sm_class_routine_updates ---
CREATE TABLE `sm_class_routine_updates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `day` int DEFAULT NULL COMMENT '1=sat,2=sun,7=fri',
  `active_status` tinyint NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_break` tinyint DEFAULT NULL COMMENT '1 = tiffin time, 0 = class',
  `room_id` int unsigned DEFAULT NULL,
  `teacher_id` int unsigned DEFAULT NULL,
  `class_period_id` int unsigned DEFAULT NULL,
  `subject_id` int unsigned DEFAULT NULL,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `created_by` int unsigned DEFAULT '1',
  `updated_by` int unsigned DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `shift_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_class_routine_updates_room_id_foreign` (`room_id`),
  KEY `sm_class_routine_updates_teacher_id_foreign` (`teacher_id`),
  KEY `sm_class_routine_updates_class_period_id_foreign` (`class_period_id`),
  KEY `sm_class_routine_updates_subject_id_foreign` (`subject_id`),
  KEY `sm_class_routine_updates_class_id_foreign` (`class_id`),
  KEY `sm_class_routine_updates_section_id_foreign` (`section_id`),
  KEY `sm_class_routine_updates_school_id_foreign` (`school_id`),
  KEY `sm_class_routine_updates_academic_id_foreign` (`academic_id`),
  CONSTRAINT `sm_class_routine_updates_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_class_period_id_foreign` FOREIGN KEY (`class_period_id`) REFERENCES `sm_class_times` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `sm_class_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `sm_subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routine_updates_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `sm_staffs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_class_routine_updates`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_class_routine_updates` WRITE;
/*!40000 ALTER TABLE `sm_class_routine_updates` DISABLE KEYS */;
INSERT INTO `sm_class_routine_updates` VALUES (1,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(2,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(3,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(4,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(5,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(6,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(7,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(8,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(9,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(10,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(11,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(12,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(13,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(14,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(15,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(16,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(17,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(18,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(19,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(20,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(21,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(22,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(23,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(24,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(25,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(26,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(27,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(28,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(29,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(30,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(31,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(32,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(33,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(34,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(35,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(36,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(37,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(38,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(39,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(40,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(41,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(42,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(43,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(44,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(45,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(46,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(47,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(48,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(49,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(50,1,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL),(51,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(52,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(53,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(54,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(55,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(56,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(57,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(58,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(59,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(60,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(61,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(62,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(63,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(64,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(65,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(66,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(67,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(68,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(69,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(70,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(71,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(72,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(73,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(74,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(75,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(76,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(77,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(78,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(79,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(80,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(81,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(82,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(83,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(84,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(85,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(86,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(87,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(88,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(89,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(90,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(91,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(92,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(93,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(94,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(95,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(96,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(97,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(98,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(99,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(100,2,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL),(101,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(102,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(103,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(104,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(105,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(106,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(107,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(108,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(109,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(110,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(111,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(112,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(113,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(114,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(115,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(116,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(117,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(118,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(119,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(120,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(121,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(122,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(123,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(124,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(125,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(126,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(127,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(128,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(129,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(130,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(131,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(132,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(133,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(134,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(135,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(136,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(137,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(138,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(139,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(140,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(141,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(142,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(143,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(144,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(145,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(146,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(147,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(148,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(149,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(150,3,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL),(151,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(152,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(153,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(154,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(155,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(156,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(157,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(158,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(159,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(160,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(161,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(162,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(163,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(164,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(165,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(166,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(167,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(168,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(169,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(170,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(171,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(172,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(173,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(174,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(175,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(176,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(177,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(178,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(179,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(180,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(181,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(182,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(183,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(184,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(185,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(186,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(187,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(188,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(189,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(190,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(191,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(192,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(193,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(194,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(195,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(196,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(197,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(198,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(199,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(200,4,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL),(201,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(202,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(203,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(204,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(205,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(206,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(207,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(208,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(209,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(210,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(211,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(212,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(213,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(214,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(215,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(216,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(217,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(218,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(219,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(220,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(221,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(222,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(223,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(224,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(225,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(226,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(227,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(228,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(229,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(230,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(231,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(232,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(233,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(234,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(235,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(236,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(237,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(238,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(239,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(240,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(241,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(242,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(243,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(244,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(245,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(246,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(247,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(248,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(249,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(250,5,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL),(251,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(252,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(253,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(254,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(255,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(256,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(257,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(258,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(259,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(260,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(261,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(262,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(263,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(264,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(265,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(266,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(267,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(268,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(269,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(270,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(271,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(272,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(273,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(274,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(275,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(276,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(277,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(278,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(279,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(280,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(281,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(282,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(283,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(284,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(285,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(286,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(287,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(288,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(289,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(290,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(291,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(292,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(293,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(294,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(295,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(296,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(297,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(298,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(299,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(300,6,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL),(301,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,1,1,1,1,1,1,1,NULL),(302,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,2,1,1,1,1,1,1,NULL),(303,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,3,1,1,1,1,1,1,NULL),(304,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,4,1,1,1,1,1,1,NULL),(305,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,5,1,1,1,1,1,1,NULL),(306,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,6,1,1,1,1,1,1,NULL),(307,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,7,1,1,1,1,1,1,NULL),(308,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,8,1,1,1,1,1,1,NULL),(309,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,9,1,1,1,1,1,1,NULL),(310,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,10,1,1,1,1,1,1,NULL),(311,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,2,1,1,1,1,NULL),(312,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,2,1,2,1,1,1,1,NULL),(313,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,3,1,2,1,1,1,1,NULL),(314,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,4,1,2,1,1,1,1,NULL),(315,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,5,1,2,1,1,1,1,NULL),(316,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,6,1,2,1,1,1,1,NULL),(317,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,8,NULL,7,1,2,1,1,1,1,NULL),(318,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,8,1,2,1,1,1,1,NULL),(319,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,9,1,2,1,1,1,1,NULL),(320,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,2,1,1,1,1,NULL),(321,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,3,1,1,1,1,NULL),(322,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,2,1,3,1,1,1,1,NULL),(323,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,3,1,3,1,1,1,1,NULL),(324,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,4,1,3,1,1,1,1,NULL),(325,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,41,NULL,5,1,3,1,1,1,1,NULL),(326,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,35,NULL,6,1,3,1,1,1,1,NULL),(327,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,7,1,3,1,1,1,1,NULL),(328,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,8,1,3,1,1,1,1,NULL),(329,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,6,NULL,9,1,3,1,1,1,1,NULL),(330,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,10,1,3,1,1,1,1,NULL),(331,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,1,1,4,1,1,1,1,NULL),(332,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,2,1,4,1,1,1,1,NULL),(333,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,3,1,4,1,1,1,1,NULL),(334,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,4,1,4,1,1,1,1,NULL),(335,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,5,1,4,1,1,1,1,NULL),(336,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,4,NULL,6,1,4,1,1,1,1,NULL),(337,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,42,NULL,7,1,4,1,1,1,1,NULL),(338,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,8,1,4,1,1,1,1,NULL),(339,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,9,1,4,1,1,1,1,NULL),(340,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,38,NULL,10,1,4,1,1,1,1,NULL),(341,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,40,NULL,1,1,5,1,1,1,1,NULL),(342,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,2,1,5,1,1,1,1,NULL),(343,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,3,1,5,1,1,1,1,NULL),(344,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,36,NULL,4,1,5,1,1,1,1,NULL),(345,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,37,NULL,5,1,5,1,1,1,1,NULL),(346,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,39,NULL,6,1,5,1,1,1,1,NULL),(347,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,34,NULL,7,1,5,1,1,1,1,NULL),(348,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,8,1,5,1,1,1,1,NULL),(349,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,5,NULL,9,1,5,1,1,1,1,NULL),(350,7,1,'2026-05-15 06:53:04','2026-05-15 06:53:04','09:00:00','09:45:00',NULL,NULL,7,NULL,10,1,5,1,1,1,1,NULL);

-- Schema for sm_class_routines ---
CREATE TABLE `sm_class_routines` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `monday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monday_room_id` int unsigned DEFAULT NULL,
  `tuesday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tuesday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tuesday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tuesday_room_id` int unsigned DEFAULT NULL,
  `wednesday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wednesday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wednesday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wednesday_room_id` int unsigned DEFAULT NULL,
  `thursday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thursday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thursday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thursday_room_id` int unsigned DEFAULT NULL,
  `friday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friday_room_id` int unsigned DEFAULT NULL,
  `saturday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saturday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saturday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saturday_room_id` int unsigned DEFAULT NULL,
  `sunday` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sunday_start_from` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sunday_end_to` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sunday_room_id` int unsigned DEFAULT NULL,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `subject_id` int unsigned DEFAULT NULL,
  `created_by` int unsigned DEFAULT '1',
  `updated_by` int unsigned DEFAULT '1',
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `sm_class_routines_class_id_foreign` (`class_id`),
  KEY `sm_class_routines_section_id_foreign` (`section_id`),
  KEY `sm_class_routines_subject_id_foreign` (`subject_id`),
  KEY `sm_class_routines_school_id_foreign` (`school_id`),
  KEY `sm_class_routines_academic_id_foreign` (`academic_id`),
  CONSTRAINT `sm_class_routines_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routines_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routines_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routines_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_routines_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `sm_subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_class_routines`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_class_routines` WRITE;
/*!40000 ALTER TABLE `sm_class_routines` DISABLE KEYS */;
/*!40000 ALTER TABLE `sm_class_routines` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `sm_class_sections`
--

DROP TABLE IF EXISTS `sm_class_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sm_class_sections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `active_status` tinyint NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `class_id` int unsigned DEFAULT NULL,
  `section_id` int unsigned DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `academic_id` int unsigned DEFAULT '1',
  `parent_id` int DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sm_class_sections_section_id_foreign` (`section_id`),
  KEY `sm_class_sections_school_id_foreign` (`school_id`),
  KEY `sm_class_sections_academic_id_foreign` (`academic_id`),
  KEY `sm_class_sections_class_id_section_id_index` (`class_id`,`section_id`),
  CONSTRAINT `sm_class_sections_academic_id_foreign` FOREIGN KEY (`academic_id`) REFERENCES `sm_academic_years` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_sections_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `sm_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_sections_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sm_class_sections_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sm_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_class_sections`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_class_sections` WRITE;
/*!40000 ALTER TABLE `sm_class_sections` DISABLE KEYS */;
INSERT INTO `sm_class_sections` VALUES (1,1,'2026-05-15 06:53:03','2026-05-15 06:53:03',1,1,1,1,NULL,NULL),(2,1,'2026-05-15 06:53:03','2026-05-15 06:53:03',1,2,1,1,NULL,NULL),(3,1,'2026-05-15 06:53:03','2026-05-15 06:53:03',1,3,1,1,NULL,NULL),(4,1,'2026-05-15 06:53:03','2026-05-15 06:53:03',1,4,1,1,NULL,NULL),(5,1,'2026-05-15 06:53:03','2026-05-15 06:53:03',1,5,1,1,NULL,NULL);

-- Schema for sm_student_behaviors ---
CREATE TABLE `sm_student_behaviors` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `behavior_type` enum('good','average','misbehavior') NOT NULL DEFAULT 'good',
  `category` enum('discipline','attitude','conduct') NOT NULL DEFAULT 'discipline',
  `remarks` text,
  `reported_by` varchar(200) DEFAULT NULL,
  `reported_date` date DEFAULT NULL,
  `school_id` int unsigned DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sm_student_behaviors`
--

-- Removed lock/unlock statement: LOCK TABLES `sm_student_behaviors` WRITE;
/*!40000 ALTER TABLE `sm_student_behaviors` DISABLE KEYS */;
INSERT INTO `sm_student_behaviors` VALUES (1,1,'good','discipline','Excellent classroom behavior','Mrs. Smith','2026-05-01',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(2,1,'good','attitude','Very attentive in class','Mr. Kumar','2026-05-05',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(3,2,'average','conduct','Needs improvement in punctuality','Mrs. Smith','2026-05-02',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(4,3,'good','discipline','Always follows rules','Mr. Kumar','2026-05-03',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(5,4,'misbehavior','attitude','Disrupted class twice','Mrs. Johnson','2026-05-04',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(6,5,'good','conduct','Helpful to other students','Mrs. Smith','2026-05-06',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(7,6,'average','discipline','Occasionally late','Mr. Kumar','2026-05-07',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(8,7,'good','attitude','Shows great interest','Mrs. Johnson','2026-05-08',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(9,8,'good','discipline','Model student','Mrs. Smith','2026-05-09',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(10,9,'misbehavior','conduct','Used phone during class','Mr. Kumar','2026-05-10',1,'2026-05-16 07:04:00','2026-05-16 07:04:00'),(11,10,'average','attitude','Improving gradually','Mrs. Johnson','2026-05-11',1,'2026-05-16 07:04:00','2026-05-16 07:04:00');

-- Schema for timetable_rules ---
CREATE TABLE `timetable_rules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `section_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `required_periods` int NOT NULL DEFAULT '1',
  `school_id` int NOT NULL DEFAULT '1',
  `academic_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable_rules`
--

-- Removed lock/unlock statement: LOCK TABLES `timetable_rules` WRITE;
/*!40000 ALTER TABLE `timetable_rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `timetable_rules` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `timetable_teacher_constraints`
--

DROP TABLE IF EXISTS `timetable_teacher_constraints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable_teacher_constraints` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` int DEFAULT NULL,
  `max_periods_per_day` int NOT NULL DEFAULT '5',
  `max_periods_per_week` int NOT NULL DEFAULT '30',
  `school_id` int NOT NULL DEFAULT '1',
  `academic_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable_teacher_constraints`
--

-- Removed lock/unlock statement: LOCK TABLES `timetable_teacher_constraints` WRITE;
/*!40000 ALTER TABLE `timetable_teacher_constraints` DISABLE KEYS */;
/*!40000 ALTER TABLE `timetable_teacher_constraints` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `transcations`
--

DROP TABLE IF EXISTS `transcations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transcations` (
  `id` int NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'debit',
  `payment_method` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `morphable_id` bigint unsigned DEFAULT NULL,
  `morphable_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` bigint NOT NULL DEFAULT '0',
  `transaction_date` date DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `school_id` int NOT NULL DEFAULT '1',
  `academic_id` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `transcations_user_id_foreign` (`user_id`),
  CONSTRAINT `transcations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transcations`
--

-- Removed lock/unlock statement: LOCK TABLES `transcations` WRITE;
/*!40000 ALTER TABLE `transcations` DISABLE KEYS */;
/*!40000 ALTER TABLE `transcations` ENABLE KEYS */;
-- Removed lock/unlock statement: UNLOCK TABLES;

--
-- Table structure for table `two_factor_settings`
--

DROP TABLE IF EXISTS `two_factor_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `two_factor_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `via_sms` tinyint(1) NOT NULL DEFAULT '0',
  `via_email` tinyint(1) NOT NULL DEFAULT '1',
  `for_student` tinyint NOT NULL DEFAULT '2',
  `for_parent` tinyint NOT NULL DEFAULT '3',
  `for_teacher` tinyint NOT NULL DEFAULT '4',
  `for_staff` tinyint NOT NULL DEFAULT '6',
  `for_admin` tinyint NOT NULL DEFAULT '1',
  `expired_time` double NOT NULL DEFAULT '300',
  `school_id` int unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `two_factor_settings_school_id_foreign` (`school_id`),
  CONSTRAINT `two_factor_settings_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `sm_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `two_factor_settings`
--

-- Removed lock/unlock statement: LOCK TABLES `two_factor_settings` WRITE;
/*!40000 ALTER TABLE `two_factor_settings` DISABLE KEYS */;
INSERT INTO `two_factor_settings` VALUES (1,0,1,2,3,4,6,1,300,1,'2026-05-15 06:52:50','2026-05-15 06:52:50');

SET FOREIGN_KEY_CHECKS=1;
