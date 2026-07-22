-- Add feedback and AI evaluation columns to Vendor Performance table
ALTER TABLE sm_vendor_performances
ADD COLUMN feedback TEXT NULL AFTER blacklist_recommendation;
