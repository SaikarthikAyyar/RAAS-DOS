-- Photos/videos captured during Job Execution (Phase 2) - the same
-- concept as customer_media (Sales Survey's own upload), scoped to a
-- real execution_id instead of a customer_request_id. Uploaded only
-- from the staff-facing Execution tab; the Customer Portal reads the
-- same rows back in read-only form, never writes to this table.

CREATE TABLE IF NOT EXISTS execution_media (
    id SERIAL PRIMARY KEY,
    execution_id INTEGER NOT NULL REFERENCES executions(id),
    media_type VARCHAR(20),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    uploaded_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_execution_media_execution_id ON execution_media(execution_id);
