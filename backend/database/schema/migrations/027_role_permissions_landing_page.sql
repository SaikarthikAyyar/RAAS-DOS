ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS is_landing_page BOOLEAN NOT NULL DEFAULT FALSE;

-- At most one landing page per role - defense in depth alongside the
-- app-layer check, same pattern as the one-Other-value-per-list index
-- on lookup_list_values.
CREATE UNIQUE INDEX IF NOT EXISTS uq_role_permissions_one_landing_page
    ON role_permissions(role_id) WHERE is_landing_page = true;
