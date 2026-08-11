-- Lookup Lists: real, admin-editable option lists backing every
-- static-array dropdown across Business Masters, Customer Request,
-- and Sales Survey. Replaces frontend/src/data/salesSurveyOptions.js
-- and customerMasterOptions.js (plus several hardcoded-inline arrays)
-- as the source of truth for dropdown options. See Phase 11 in the
-- cumulative plan file for full context.

CREATE TABLE IF NOT EXISTS lookup_lists (
    id SERIAL PRIMARY KEY,
    list_key VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- is_other: selecting this value swaps the dropdown to a free-text
-- input bound to the SAME underlying field (no separate column) -
-- see LookupSelect.jsx.
-- conditional_tag: NULL = always shown; a tag means this option is
-- only included when the caller explicitly requests that tag (e.g.
-- 'channel_partner' Lead Source options).
-- is_active: soft delete, so a historical submission referencing a
-- since-removed option still resolves correctly.
CREATE TABLE IF NOT EXISTS lookup_list_values (
    id SERIAL PRIMARY KEY,
    lookup_list_id INTEGER NOT NULL REFERENCES lookup_lists(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    is_other BOOLEAN NOT NULL DEFAULT false,
    conditional_tag VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(lookup_list_id, value)
);

CREATE INDEX IF NOT EXISTS idx_lookup_list_values_list_id ON lookup_list_values(lookup_list_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_lookup_list_values_one_other
    ON lookup_list_values(lookup_list_id)
    WHERE is_other = true AND is_active = true;
