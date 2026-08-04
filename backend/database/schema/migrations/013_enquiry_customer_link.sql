-- Links Enquiry creation to the Business Master Customer/Asset
-- records (Phase 2 of the Business Master initiative), matching
-- submitNewEnquiry()/findOrCreateAssetPath() in the wireframe.
-- customer_name is a denormalized snapshot (matches the wireframe's
-- flat c.customer string on cases) so the Enquiries list doesn't
-- need a join on every fetch.

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(id);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS asset_id INTEGER REFERENCES assets(id);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS customer_name VARCHAR(150);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS nature VARCHAR(50);

ALTER TABLE customer_requests ADD COLUMN IF NOT EXISTS nature_of_job VARCHAR(50);
