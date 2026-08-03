-- Quote & Commercial tab: internal-only addition (commission) and
-- release-to-client tracking. See quoteTab() in the wireframe.

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS internal_extra_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS internal_extra_amount FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS internal_extra_note VARCHAR(500);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS valid_till VARCHAR(20);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS released BOOLEAN DEFAULT FALSE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS released_by VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS released_date VARCHAR(20);
