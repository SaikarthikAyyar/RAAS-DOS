-- New Business Masters tab: Machine Inventory (physical stock/assets),
-- distinct from the existing Machines / Fleet spec catalog. Each
-- inventory row is now grouped under a real machine type - a proper
-- FK to the machines spec catalog, replacing the fragile code-prefix
-- matching used elsewhere (fleet_availability_service.py,
-- quote_engine.py) with a real relationship for every row created
-- from here going forward. Existing rows get backfilled by the same
-- prefix match, one time, as part of this migration.

ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS machine_type_id INTEGER REFERENCES machines(id);

UPDATE machine_inventory mi
SET machine_type_id = m.id
FROM machines m
WHERE mi.machine_type_id IS NULL
  AND mi.machine_code LIKE (m.code || '-%');
