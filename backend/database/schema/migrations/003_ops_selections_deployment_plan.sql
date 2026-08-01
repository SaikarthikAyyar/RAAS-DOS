-- ====================================
-- OPS SELECTIONS: DEPLOYMENT PLAN
-- Adds crew_plan / accessories_plan / dewatering method
-- range so the Ops Review tab's "Deployment plan" card can
-- match the wireframe (wireframe parity).
-- ====================================

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS crew_plan JSONB;

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS accessories_plan JSONB;

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS dewatering_method_min VARCHAR(100);

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS dewatering_method_max VARCHAR(100);
