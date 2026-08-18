-- ====================================
-- QUOTE & COMMERCIAL GATE
-- Techno-Commercial's old standalone approval is retired (its tab
-- becomes a read-only "Techno-Commercial Review"); the hub-approver
-- gate it used to own moves to the Quote & Commercial tab instead.
-- This migration:
--   1. Renames the workflow stage slot in place (not a skip, not a
--      new stage) - any enquiry sitting at the old stage is correctly
--      "awaiting the Quote & Commercial gate", not stuck.
--   2. Renames the hub_approvers.approval_type value that used to
--      grant Techno-Commercial standing so it now grants Quote &
--      Commercial standing - same rows, same meaning-shift as the
--      stage rename above.
--   3. Renames the Quote decision columns Techno-Commercial's old
--      approve action used to write, since the Quote & Commercial
--      gate now owns that decision instead.
-- ====================================

UPDATE enquiries SET stage = 'QUOTE_COMMERCIAL_REVIEW' WHERE stage = 'TECHNO_COMMERCIAL_APPROVAL';

UPDATE hub_approvers SET approval_type = 'quote_commercial' WHERE approval_type = 'techno_commercial';

-- Column renames guarded so this migration is safe to re-run.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='techno_status') THEN
        ALTER TABLE quotes RENAME COLUMN techno_status TO quote_commercial_status;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='techno_approved_by') THEN
        ALTER TABLE quotes RENAME COLUMN techno_approved_by TO quote_commercial_approved_by;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='techno_approved_date') THEN
        ALTER TABLE quotes RENAME COLUMN techno_approved_date TO quote_commercial_approved_date;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='techno_note') THEN
        ALTER TABLE quotes RENAME COLUMN techno_note TO quote_commercial_note;
    END IF;
END $$;
