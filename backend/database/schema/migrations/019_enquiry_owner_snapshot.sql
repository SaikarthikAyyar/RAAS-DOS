-- Snapshot of the linked Business Master Customer's `owner` at the
-- moment the Enquiry is created (matches the existing customer_name/
-- nature snapshot pattern) - the pre-existing owner_role/owner_user_id
-- columns are never written anywhere in the codebase and are a
-- different concept (workflow role assignment, not a customer's
-- account owner), so this is a new column rather than repurposing
-- those.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS owner VARCHAR(150);
