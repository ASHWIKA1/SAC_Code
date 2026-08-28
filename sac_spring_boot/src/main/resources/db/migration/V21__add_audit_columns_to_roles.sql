ALTER TABLE `roles` ADD COLUMN `created_by` bigint DEFAULT NULL;
ALTER TABLE `roles` ADD COLUMN `updated_by` bigint DEFAULT NULL;

ALTER TABLE `permissions` ADD COLUMN `created_by` bigint DEFAULT NULL;
ALTER TABLE `permissions` ADD COLUMN `updated_by` bigint DEFAULT NULL;

ALTER TABLE `sm_menus` ADD COLUMN `created_by` bigint DEFAULT NULL;
ALTER TABLE `sm_menus` ADD COLUMN `updated_by` bigint DEFAULT NULL;

ALTER TABLE `assign_permissions` ADD COLUMN `created_by` bigint DEFAULT NULL;
ALTER TABLE `assign_permissions` ADD COLUMN `updated_by` bigint DEFAULT NULL;
