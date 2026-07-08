-- Refined Groups Master Table
CREATE TABLE IF NOT EXISTS discussion_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    created_by_faculty INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '1 = Trashed from UI list',
    
    FOREIGN KEY (created_by_faculty) REFERENCES users(id) ON DELETE CASCADE
);

-- Refined Messages Table (Maintains logs even if group is hidden from sidebar)
CREATE TABLE IF NOT EXISTS forum_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    sender_id INT UNSIGNED NOT NULL,
    message_text TEXT NOT NULL,
    attachment_url VARCHAR(500) DEFAULT NULL,
    attachment_type VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0,
    
    FOREIGN KEY (group_id) REFERENCES discussion_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT * FROM discussion_groups WHERE is_deleted = 0;