-- Seed SuperAdmin (hashed password: 'password')
INSERT INTO `super_admins` (`id`, `username`, `email`, `password`, `full_name`, `phone_number`, `active_status`, `role`) VALUES 
(1, 'superadmin', 'superadmin@sacgotek.com', '$2a$10$tM.yO.z3k11hHnKxY0FjOes9c5qG2X8yU5u5s00t5eR.5G/8YgYtC', 'System SuperAdmin', '9999999999', 1, 'super_admin');

-- Seed School Admin User (hashed password: 'password')
INSERT INTO `users` (`id`, `name`, `email`, `username`, `password`, `phone`, `is_administrator`, `active_status`, `role_id`, `school_id`) VALUES 
(1, 'Demo School Admin', 'admin@sacgotek.com', 'admin', '$2a$10$tM.yO.z3k11hHnKxY0FjOes9c5qG2X8yU5u5s00t5eR.5G/8YgYtC', '1234567890', 1, 1, 1, 1);
