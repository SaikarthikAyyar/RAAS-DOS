-- ====================================
-- SALES SURVEYS: MISSING FIELDS
-- Adds columns for fields that exist in the
-- Sales Survey form UI but have never had
-- anywhere to be stored.
-- ====================================

ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS nearest_hub VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS urgency VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS access_type VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS equipment_nearby VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS power_distance FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS target_flow FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS suction_depth FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS discharge_distance FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS discharge_height FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS dewatering_required VARCHAR(20);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS dewatering_volume FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS inlet_moisture FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS visible_free_water VARCHAR(20);

-- opening_height was referenced in the schema/service layer already but
-- had no backing column at all - a pre-existing gap, caught while testing.
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS opening_height FLOAT;
