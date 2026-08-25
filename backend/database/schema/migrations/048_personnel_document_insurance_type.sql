-- Insurance documents get a free-typed "Insurance Type" field, entered
-- by the user (not a lookup list) - NULL/unused for every other
-- document_type.
ALTER TABLE personnel_documents ADD COLUMN IF NOT EXISTS insurance_type VARCHAR(150);
