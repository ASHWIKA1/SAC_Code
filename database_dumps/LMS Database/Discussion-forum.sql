-- Refined Groups Master Table
CREATE TABLE IF NOT EXISTS discussion_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    created_by_faculty INT NOT NULL,
    active_status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '1 = Trashed from UI list',
    
    KEY idx_discussion_groups_created_by_faculty (created_by_faculty)
);

-- Discussion Group Members Table
CREATE TABLE IF NOT EXISTS discussion_group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    CONSTRAINT fk_discussion_group_members_group_id FOREIGN KEY (group_id) REFERENCES discussion_groups(id) ON DELETE CASCADE,
    UNIQUE KEY idx_discussion_group_members_group_user (group_id, user_id),
    KEY idx_discussion_group_members_user_id (user_id)
);

-- Refined Messages Table (Maintains logs even if group is hidden from sidebar)
CREATE TABLE IF NOT EXISTS forum_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    group_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    attachment_url VARCHAR(500) DEFAULT NULL,
    attachment_type VARCHAR(50) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0,
    
    CONSTRAINT fk_forum_messages_group_id FOREIGN KEY (group_id) REFERENCES discussion_groups(id) ON DELETE CASCADE,
    KEY idx_forum_messages_sender_id (sender_id)
);

SELECT * FROM discussion_groups WHERE is_deleted = 0;