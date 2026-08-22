-- ====================================
-- FIX: lookup_list_values uniqueness must be scoped to is_active
-- Root cause of a real production error (raw psycopg2.UniqueViolation
-- surfacing as an unhandled 500, which is what caused the CORS-looking
-- symptom - see Phase 32): the original UNIQUE(lookup_list_id, value)
-- constraint (022_lookup_lists.sql) applies regardless of is_active,
-- so once a value is soft-deleted it can NEVER be re-added under the
-- same text - the exact "Others" was previously removed and now can't
-- be re-added" situation hit live on Discharge Medium.
--
-- Fixed the same way uq_lookup_list_values_one_other already handles
-- this class of problem: a PARTIAL unique index scoped to
-- is_active = true. Historical soft-deleted rows stay in the table
-- (still resolve for old submissions that reference them) but no
-- longer block a fresh active row from reusing the same text.
-- ====================================

ALTER TABLE lookup_list_values DROP CONSTRAINT IF EXISTS lookup_list_values_lookup_list_id_value_key;

CREATE UNIQUE INDEX IF NOT EXISTS uq_lookup_list_values_active_value
    ON lookup_list_values(lookup_list_id, value)
    WHERE is_active = true;
