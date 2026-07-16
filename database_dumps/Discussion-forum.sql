-- Refined Groups Master Table
CREATE TABLE IF NOT EXISTS discussion_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    created_by_faculty INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    updated_by BIGINT,
    is_deleted INT DEFAULT 0 COMMENT '1 = Trashed from UI list',
    
    KEY idx_discussion_groups_created_by_faculty (created_by_faculty)
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