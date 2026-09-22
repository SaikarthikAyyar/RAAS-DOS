-- A Fleet Unit can now bundle several machines together - some for
-- transport, some for the job itself - booked, moved and released as
-- one. fleet_units.machine_inventory_id (NOT NULL, kept for backward
-- compatibility) becomes a "primary machine" pointer: it always mirrors
-- whichever machine in fleet_unit_machines is marked PRIMARY, and stays
-- in sync automatically on every save. Real membership is read from
-- fleet_unit_machines from now on; the old column is superseded, not
-- removed, matching this project's non-destructive convention.

CREATE TABLE IF NOT EXISTS fleet_unit_machines (
    id SERIAL PRIMARY KEY,
    fleet_unit_id INTEGER NOT NULL REFERENCES fleet_units(id) ON DELETE CASCADE,
    machine_inventory_id INTEGER NOT NULL REFERENCES machine_inventory(id),
    -- PRIMARY: the machine actually doing the job (drives pump/accessory
    -- compatibility, service configuration, etc.). SUPPORT: everything
    -- else bundled along (a transport vehicle, a genset...). Exactly
    -- one PRIMARY per fleet unit, enforced at the application layer.
    role VARCHAR(20) NOT NULL DEFAULT 'PRIMARY',
    CONSTRAINT uq_fleet_unit_machine UNIQUE (fleet_unit_id, machine_inventory_id)
);

CREATE INDEX IF NOT EXISTS idx_fleet_unit_machines_unit ON fleet_unit_machines(fleet_unit_id);
CREATE INDEX IF NOT EXISTS idx_fleet_unit_machines_machine ON fleet_unit_machines(machine_inventory_id);

-- Backfill: every existing fleet unit's single machine becomes its one
-- PRIMARY machine, so nothing about today's units changes in behaviour.
INSERT INTO fleet_unit_machines (fleet_unit_id, machine_inventory_id, role)
SELECT fu.id, fu.machine_inventory_id, 'PRIMARY'
FROM fleet_units fu
WHERE NOT EXISTS (
    SELECT 1 FROM fleet_unit_machines x WHERE x.fleet_unit_id = fu.id
);
