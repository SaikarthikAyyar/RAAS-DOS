-- Commercial Approval tab: decision note + the settled final value
-- (distinct from the min/max range), matching commercialApprovalTab()
-- and commercialApprovalDecision() in the wireframe.

ALTER TABLE approval_boards ADD COLUMN IF NOT EXISTS note VARCHAR(500);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS final_approved_value FLOAT;
