-- Supabase-only fix: approval_boards.approval_date was created as
-- VARCHAR on Supabase at some point, while the SQLAlchemy model
-- (backend/models/approval_board.py) declares it DateTime, matching
-- what local Postgres already has. Found via a full local-vs-Supabase
-- schema audit (2026-08-04). Existing values are all valid ISO
-- timestamps, so this converts in place with no data loss.

ALTER TABLE approval_boards
    ALTER COLUMN approval_date TYPE TIMESTAMP WITHOUT TIME ZONE
    USING approval_date::timestamp without time zone;
