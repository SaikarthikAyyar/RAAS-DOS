-- ====================================
-- OPS SELECTIONS: OPS REVIEW DECISION
-- Adds review_status / reviewed_by / reviewed_date / review_note
-- so the Ops Review tab's "Ops Review decision" card can persist
-- the Approve / Send back decision (wireframe parity).
-- ====================================

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS review_status VARCHAR(50) DEFAULT 'Pending';

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(100);

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS reviewed_date VARCHAR(20);

ALTER TABLE ops_selections
    ADD COLUMN IF NOT EXISTS review_note VARCHAR(500);
