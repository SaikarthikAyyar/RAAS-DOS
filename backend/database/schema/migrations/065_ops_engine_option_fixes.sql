-- Ops Engine / Sales Survey option fixes (safe to re-run).
--
-- 1. Temperature Range options were stored with a double-encoded degree
--    sign (U+00C2 U+00B0 instead of U+00B0), so the Ops Engine's
--    temperature table could never match Hot / Very Hot / Cold. Repaired
--    with chr() so this file is immune to console/client encoding.
-- 2. Section B's "pH / Corrosiveness (Material)" gets its OWN list with
--    severity bands (the shared "ph" list stays for Section E's pump
--    field). Existing stored values are migrated to the band that keeps
--    their previous scoring behaviour (Acidic/Alkaline were both scored
--    as "extreme").
-- 3. Matsya D / EV listed a preferred material, "Pond silt", that is not
--    a Material Category option - replaced with "Settled sludge" so the
--    +30 material match can actually fire.

-- ------------------------------------------------------------------
-- 1. Temperature options / survey values
-- ------------------------------------------------------------------
UPDATE lookup_list_values
   SET value = replace(value, chr(194) || chr(176), chr(176))
 WHERE value LIKE '%' || chr(194) || chr(176) || '%';

UPDATE sales_surveys
   SET temperature_range = replace(temperature_range, chr(194) || chr(176), chr(176))
 WHERE temperature_range LIKE '%' || chr(194) || chr(176) || '%';

-- ------------------------------------------------------------------
-- 2. Material pH list + migration of stored values
-- ------------------------------------------------------------------
INSERT INTO lookup_lists (list_key, display_name, module, description)
VALUES ('materialPh', 'pH / Corrosiveness (Material)', 'sales_survey',
        'Severity bands for the sludge material''s own pH (Sales Survey Section B).')
ON CONFLICT (list_key) DO NOTHING;

INSERT INTO lookup_list_values (lookup_list_id, value, sort_order)
SELECT l.id, v.value, v.ord
  FROM lookup_lists l,
       (VALUES ('Strongly acidic (pH < 4)', 0),
               ('Mildly acidic (pH 4-6)', 1),
               ('Neutral (pH 6-8)', 2),
               ('Mildly alkaline (pH 8-10)', 3),
               ('Strongly alkaline (pH > 10)', 4)) AS v(value, ord)
 WHERE l.list_key = 'materialPh'
ON CONFLICT DO NOTHING;

UPDATE sales_surveys
   SET material_ph_condition = CASE material_ph_condition
        WHEN 'Acidic' THEN 'Strongly acidic (pH < 4)'
        WHEN 'Alkaline' THEN 'Strongly alkaline (pH > 10)'
        WHEN 'Low / Neutral' THEN 'Neutral (pH 6-8)'
       END
 WHERE material_ph_condition IN ('Acidic', 'Alkaline', 'Low / Neutral');

UPDATE assets
   SET profile = jsonb_set(profile, '{material_ph_condition}', to_jsonb(CASE profile->>'material_ph_condition'
        WHEN 'Acidic' THEN 'Strongly acidic (pH < 4)'::text
        WHEN 'Alkaline' THEN 'Strongly alkaline (pH > 10)'::text
        WHEN 'Low / Neutral' THEN 'Neutral (pH 6-8)'::text
       END))
 WHERE profile->>'material_ph_condition' IN ('Acidic', 'Alkaline', 'Low / Neutral');

-- ------------------------------------------------------------------
-- 3. Machines: "Pond silt" is not a Material Category option
-- ------------------------------------------------------------------
UPDATE machines
   SET preferred_materials = (preferred_materials - 'Pond silt') || '"Settled sludge"'::jsonb
 WHERE preferred_materials ? 'Pond silt'
   AND NOT (preferred_materials ? 'Settled sludge');

UPDATE machines
   SET preferred_materials = preferred_materials - 'Pond silt'
 WHERE preferred_materials ? 'Pond silt';
