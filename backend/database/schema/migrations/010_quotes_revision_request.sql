-- Quote & Commercial tab: "Request Revision" gate on Proceed to
-- Commercial Approval. Flag lives on the quote row itself so a fresh
-- save (a new row, revision_requested defaults false) naturally
-- clears it - reading this straight off the freshly-fetched latest
-- quote keeps concurrent users consistent without any cross-request
-- locking.

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS revision_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS revision_requested_by VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS revision_requested_date VARCHAR(20);
