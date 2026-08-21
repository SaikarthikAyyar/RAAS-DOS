-- ====================================
-- PHASE: Business Masters - Personnel, Human Resources, GST & Tax
-- Also closes 3 real lookup-list gaps found while auditing the
-- Machines/Pumps/Personnel tabs against the wireframe's bm.lists:
-- materialOfConstruction/hazardousAreaRating (Machines/Pumps'
-- "Material construction"/"Hazard rating" fields were plain free-text
-- inputs, not dropdowns) and personnelDocTypes (needed fresh for the
-- new Personnel tab's document-type picker).
-- ====================================

-- ====================================
-- LOOKUP LISTS
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module, description) VALUES
    ('materialOfConstruction', 'Material of Construction', 'business_masters',
     'Used in: Machines/Fleet and Pump Master -> Material Construction - drives the corrosion-risk check in Ops Engine scoring.')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Mild Steel',0),('Stainless Steel 304',1),('Stainless Steel 316',2),
             ('Corrosion-resistant coated',3)) AS v(value, ord)
WHERE list_key='materialOfConstruction' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module, description) VALUES
    ('hazardousAreaRating', 'Hazardous Area (ATEX) Rating', 'business_masters',
     'Used in: Machines/Fleet and Pump Master -> Hazard Rating - drives the hard ATEX disqualify in Ops Engine scoring.')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Standard',0),('ATEX Zone 1',1),('ATEX Zone 2',2),('Not rated',3)) AS v(value, ord)
WHERE list_key='hazardousAreaRating' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module, description) VALUES
    ('personnelDocTypes', 'Personnel Document Types', 'business_masters',
     'Used in: Personnel -> each person''s document list (type picker).')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Insurance',0),('ID Proof',1),('Driving License',2),('Medical Certificate',3),
             ('Training Certificate',4),('Police Verification',5)) AS v(value, ord)
WHERE list_key='personnelDocTypes' ON CONFLICT (lookup_list_id, value) DO NOTHING;


-- ====================================
-- PERSONNEL DOCUMENTS: expiry tracking
-- Matches the wireframe's "Valid till" per-document field, which
-- drives its expired-document red-pill highlighting - no equivalent
-- column existed on the real personnel_documents table.
-- ====================================

ALTER TABLE personnel_documents ADD COLUMN IF NOT EXISTS valid_till DATE;


-- ====================================
-- HUMAN RESOURCES: day rates by role
-- A real, admin-editable master (matches the wireframe's bm.hr) - the
-- role dropdown on Personnel reads from this table instead of a
-- hardcoded list, so it has a genuine downstream use immediately even
-- before any quote-engine wiring.
-- ====================================

CREATE TABLE IF NOT EXISTS hr_roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(100) UNIQUE NOT NULL,
    day_rate NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

INSERT INTO hr_roles (role, day_rate) VALUES
    ('Supervisor', 8500),
    ('Operator', 6500),
    ('Helper', 2500),
    ('Safety Officer', 7000)
ON CONFLICT (role) DO NOTHING;


-- ====================================
-- GST & TAX
-- Single-row config, same pattern as commercial_rules.
-- ====================================

CREATE TABLE IF NOT EXISTS gst_settings (
    id SERIAL PRIMARY KEY,
    rate NUMERIC(5,2) NOT NULL,
    treatment VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT now()
);

INSERT INTO gst_settings (id, rate, treatment)
SELECT 1, 18, 'Extra as applicable'
WHERE NOT EXISTS (SELECT 1 FROM gst_settings);
