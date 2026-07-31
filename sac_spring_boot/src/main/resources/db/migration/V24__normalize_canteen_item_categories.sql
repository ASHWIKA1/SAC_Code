CREATE TABLE IF NOT EXISTS sm_canteen_item_categories (
    item_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (item_id, category_id)
);
