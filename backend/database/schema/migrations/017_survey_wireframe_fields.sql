-- Adds the wireframe survey fields our Sales Survey form was missing.
-- (abrasiveness already exists as a column from an earlier migration
-- but was never wired to a schema/repository/frontend field - no new
-- column needed for it here, just the application-layer wiring.)

-- Section A - General info
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS surveyed_by VARCHAR(150);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS survey_trigger VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS repeat_potential VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS tentative_start_date DATE;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS tentative_end_date DATE;

-- Section B - Job / sludge
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS permit_required BOOLEAN;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS flowability VARCHAR(100);

-- Section C - Geometry / access
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS tank_location VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS setup_complexity VARCHAR(100);

-- Section E - Pump
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS pump_risk VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS effective_work_hours FLOAT;

-- Section F - Dewatering
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS filtrate_route_detail TEXT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS polymer_allowed VARCHAR(255);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS commitment VARCHAR(255);

-- Section G - Customer insight
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS current_method VARCHAR(100);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS budget_known BOOLEAN;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS budget_estimate FLOAT;
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS decision_maker VARCHAR(150);
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS billing_address TEXT;
