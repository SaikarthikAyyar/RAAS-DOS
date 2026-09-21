-- Fleet Unit "kit": the compatible pumps and accessories a machine is
-- mobilised with. Stored by id (never by name) so renaming an accessory
-- in Business Masters can't orphan a fleet unit's kit.
--
-- Two levels:
--   fleet_unit_*      the unit's standing kit, shown wherever the unit is
--                     shown; only changes when a booking becomes the live
--                     one, or when edited in Business Masters.
--   fleet_schedule_*  the kit chosen for one specific booking, so a job
--                     queued behind another never overwrites the live
--                     job's kit.
--
-- pump_id / accessory_id deliberately have no ON DELETE clause: deleting
-- a pump or accessory that is in use is refused (surfaced as a clean 422)
-- instead of silently emptying kits.

CREATE TABLE IF NOT EXISTS fleet_unit_pumps (
    id SERIAL PRIMARY KEY,
    fleet_unit_id INTEGER NOT NULL REFERENCES fleet_units(id) ON DELETE CASCADE,
    pump_id INTEGER NOT NULL REFERENCES pumps(id),
    CONSTRAINT uq_fleet_unit_pump UNIQUE (fleet_unit_id, pump_id)
);

CREATE TABLE IF NOT EXISTS fleet_unit_accessories (
    id SERIAL PRIMARY KEY,
    fleet_unit_id INTEGER NOT NULL REFERENCES fleet_units(id) ON DELETE CASCADE,
    accessory_id INTEGER NOT NULL REFERENCES accessories(id),
    CONSTRAINT uq_fleet_unit_accessory UNIQUE (fleet_unit_id, accessory_id)
);

CREATE TABLE IF NOT EXISTS fleet_schedule_pumps (
    id SERIAL PRIMARY KEY,
    fleet_schedule_id INTEGER NOT NULL REFERENCES fleet_schedule(id) ON DELETE CASCADE,
    pump_id INTEGER NOT NULL REFERENCES pumps(id),
    CONSTRAINT uq_fleet_schedule_pump UNIQUE (fleet_schedule_id, pump_id)
);

CREATE TABLE IF NOT EXISTS fleet_schedule_accessories (
    id SERIAL PRIMARY KEY,
    fleet_schedule_id INTEGER NOT NULL REFERENCES fleet_schedule(id) ON DELETE CASCADE,
    accessory_id INTEGER NOT NULL REFERENCES accessories(id),
    CONSTRAINT uq_fleet_schedule_accessory UNIQUE (fleet_schedule_id, accessory_id)
);

CREATE INDEX IF NOT EXISTS idx_fleet_unit_pumps_unit ON fleet_unit_pumps(fleet_unit_id);
CREATE INDEX IF NOT EXISTS idx_fleet_unit_accessories_unit ON fleet_unit_accessories(fleet_unit_id);
CREATE INDEX IF NOT EXISTS idx_fleet_schedule_pumps_sched ON fleet_schedule_pumps(fleet_schedule_id);
CREATE INDEX IF NOT EXISTS idx_fleet_schedule_accessories_sched ON fleet_schedule_accessories(fleet_schedule_id);

-- Backfill: every existing fleet unit starts with its machine type's
-- standard accessory set (Machines / Machine Specs "accessories" list,
-- matched to the Accessories master by name) so existing units show a
-- kit immediately. Pumps are NOT backfilled - which of the compatible
-- pumps actually travels with a unit is a per-unit choice.
INSERT INTO fleet_unit_accessories (fleet_unit_id, accessory_id)
SELECT DISTINCT fu.id, a.id
FROM fleet_units fu
JOIN machine_inventory mi ON mi.id = fu.machine_inventory_id
JOIN machines m ON m.id = mi.machine_type_id
CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(m.accessories, '[]'::jsonb)) AS acc(name)
JOIN accessories a ON a.name = acc.name
WHERE NOT EXISTS (
    SELECT 1 FROM fleet_unit_accessories x WHERE x.fleet_unit_id = fu.id
)
ON CONFLICT DO NOTHING;
