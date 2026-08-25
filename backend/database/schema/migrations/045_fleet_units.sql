-- Phase 33A: Fleet & Availability foundation.
-- A Fleet Unit bundles one real machine_inventory row with a nominal
-- crew (personnel) and a home hub into one persistent, reusable,
-- ID'd entity - matching the wireframe's fleetUnits shape and the
-- reference spreadsheet's per-machine rows. Scheduling moves to the
-- Fleet Unit level going forward (fleet_schedule is a direct
-- structural copy of the already-proven machine_schedule shape) -
-- machine_schedule itself is left in place, unused, as historical
-- reference, per this project's established non-destructive
-- convention for superseded tables.

CREATE TABLE IF NOT EXISTS fleet_units (
    id SERIAL PRIMARY KEY,
    fleet_code VARCHAR(30) UNIQUE NOT NULL,
    fleet_name VARCHAR(150) NOT NULL,
    machine_inventory_id INTEGER NOT NULL REFERENCES machine_inventory(id),
    hub_id INTEGER REFERENCES hubs(id),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fleet_unit_personnel (
    id SERIAL PRIMARY KEY,
    fleet_unit_id INTEGER NOT NULL REFERENCES fleet_units(id) ON DELETE CASCADE,
    personnel_id INTEGER NOT NULL REFERENCES personnel(id),
    UNIQUE(fleet_unit_id, personnel_id)
);

CREATE TABLE IF NOT EXISTS fleet_schedule (
    id SERIAL PRIMARY KEY,
    fleet_unit_id INTEGER NOT NULL REFERENCES fleet_units(id),
    job_creation_id INTEGER NOT NULL REFERENCES job_creations(id),
    execution_id INTEGER REFERENCES executions(id),
    queue_position INTEGER NOT NULL,
    site_location VARCHAR(255) NOT NULL,
    planned_start DATE NOT NULL,
    planned_completion DATE NOT NULL,
    actual_start DATE,
    actual_completion DATE,
    schedule_status VARCHAR(20) NOT NULL DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
