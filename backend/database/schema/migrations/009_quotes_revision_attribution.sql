-- Quote & Commercial tab: Version History "By" / "Reason" columns,
-- matching the wireframe's quoteTab() version history table.

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS created_by VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS revision_reason VARCHAR(255);
