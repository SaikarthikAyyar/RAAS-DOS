-- ====================================
-- OPS SELECTIONS: HUMAN OVERRIDE
-- Adds override_machine / override_reason so the
-- Ops Review tab can capture a human override of the
-- ops_engine's recommended machine (wireframe parity).
-- ====================================

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS override_machine VARCHAR(50);

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS override_reason VARCHAR(500);
