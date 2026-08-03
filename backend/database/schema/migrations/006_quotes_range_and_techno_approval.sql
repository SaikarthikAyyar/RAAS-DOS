-- ====================================
-- QUOTES: MIN/MAX RANGE + TECHNO-COMMERCIAL
-- APPROVAL DECISION
-- Wireframe parity for the Techno-Commercial
-- Approval tab. Old single-value cost columns
-- are left in place (unused going forward) -
-- not dropped, to avoid destructive data loss
-- on existing rows.
-- ====================================

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS mobilisation_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS mobilisation_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS setup_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS setup_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS execution_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS execution_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pump_addon_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pump_addon_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS direct_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS direct_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS overhead_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS overhead_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contingency_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contingency_cost_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS margin_value_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS margin_value_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS cleaning_quote_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS cleaning_quote_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS dewatering_addon_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS dewatering_addon_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS combined_budgetary_value_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS combined_budgetary_value_max FLOAT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS techno_status VARCHAR(50) DEFAULT 'Pending';
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS techno_approved_by VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS techno_approved_date VARCHAR(20);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS techno_note VARCHAR(500);
